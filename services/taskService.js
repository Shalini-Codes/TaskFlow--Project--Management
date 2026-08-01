/* ==========================================================================
   TaskFlow Task Service API & Cloud Firestore Database Integration
   ========================================================================== */

import { 
  db, 
  collection, 
  doc, 
  addDoc, 
  getDocs, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where 
} from './firebase.js';
import { authService } from './authService.js';
import { storage, STORAGE_KEYS, INITIAL_TASKS } from '../utils/storage.js';

export const taskService = {
  // Read / Query tasks belonging to currently logged in user
  async getTasks(filters = {}) {
    const currentUser = authService.getCurrentUser();
    const userId = currentUser?.uid || currentUser?.id || 'demo_user';

    let tasks = [];

    try {
      // Query Cloud Firestore "tasks" collection filtered by active user's UID
      const q = query(collection(db, 'tasks'), where('userId', '==', userId));
      const querySnapshot = await getDocs(q);

      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        tasks.push({
          id: docSnap.id,
          ...data,
          assigneeId: data.assigneeId || data.assignee || 'u1'
        });
      });

      // Seed initial tasks in Firestore if user is logging in for the first time
      if (tasks.length === 0 && currentUser && currentUser.uid) {
        const seedTasks = INITIAL_TASKS.map((t) => ({
          title: t.title,
          description: t.description || '',
          status: t.status || 'todo',
          priority: t.priority || 'medium',
          assignee: t.assigneeId || 'u1',
          assigneeId: t.assigneeId || 'u1',
          dueDate: t.dueDate || new Date().toISOString().split('T')[0],
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          createdBy: userId,
          userId: userId
        }));

        for (const st of seedTasks) {
          const docRef = await addDoc(collection(db, 'tasks'), st);
          tasks.push({ id: docRef.id, ...st });
        }
      }

      // Sync local storage cache for instant rendering
      storage.set(STORAGE_KEYS.TASKS, tasks);
    } catch (err) {
      console.warn('Firestore fetch failed, using local cache:', err);
      tasks = storage.get(STORAGE_KEYS.TASKS, INITIAL_TASKS);
    }

    // Apply client-side search and status/priority filters
    return tasks.filter((task) => {
      if (filters.search) {
        const qStr = filters.search.toLowerCase();
        const matchesTitle = (task.title || '').toLowerCase().includes(qStr);
        const matchesDesc = (task.description || '').toLowerCase().includes(qStr);
        if (!matchesTitle && !matchesDesc) return false;
      }

      if (filters.status && filters.status !== 'all') {
        if (task.status !== filters.status) return false;
      }

      if (filters.priority && filters.priority !== 'all') {
        if (task.priority !== filters.priority) return false;
      }

      return true;
    });
  },

  // Get single task by document ID
  async getTaskById(id) {
    try {
      const docRef = doc(db, 'tasks', id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        return { id: docSnap.id, ...data, assigneeId: data.assigneeId || data.assignee || 'u1' };
      }
    } catch (err) {
      console.warn('Firestore getTaskById error:', err);
    }

    const tasks = storage.get(STORAGE_KEYS.TASKS, INITIAL_TASKS);
    return tasks.find((t) => t.id === id) || null;
  },

  // Create new task document in Cloud Firestore
  async createTask(taskData) {
    const currentUser = authService.getCurrentUser();
    const userId = currentUser?.uid || currentUser?.id || 'demo_user';

    const payload = {
      title: taskData.title || 'New Task',
      description: taskData.description || '',
      status: taskData.status || 'todo',
      priority: taskData.priority || 'medium',
      assignee: taskData.assigneeId || taskData.assignee || 'u1',
      assigneeId: taskData.assigneeId || taskData.assignee || 'u1',
      dueDate: taskData.dueDate || new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      createdBy: userId,
      userId: userId
    };

    try {
      const docRef = await addDoc(collection(db, 'tasks'), payload);
      const createdTask = { id: docRef.id, ...payload };

      const localTasks = storage.get(STORAGE_KEYS.TASKS, []);
      localTasks.unshift(createdTask);
      storage.set(STORAGE_KEYS.TASKS, localTasks);

      return createdTask;
    } catch (err) {
      console.error('Firestore createTask failed:', err);
      throw err;
    }
  },

  // Update existing task document in Cloud Firestore
  async updateTask(id, updateData) {
    const payload = {
      ...updateData,
      updatedAt: new Date().toISOString()
    };

    if (updateData.assigneeId || updateData.assignee) {
      payload.assignee = updateData.assigneeId || updateData.assignee;
      payload.assigneeId = updateData.assigneeId || updateData.assignee;
    }

    try {
      const docRef = doc(db, 'tasks', id);
      await updateDoc(docRef, payload);

      const localTasks = storage.get(STORAGE_KEYS.TASKS, []);
      const index = localTasks.findIndex((t) => t.id === id);
      if (index !== -1) {
        localTasks[index] = { ...localTasks[index], ...payload };
        storage.set(STORAGE_KEYS.TASKS, localTasks);
      }

      return { id, ...payload };
    } catch (err) {
      console.error('Firestore updateTask failed:', err);
      throw err;
    }
  },

  // Delete task document from Cloud Firestore
  async deleteTask(id) {
    try {
      const docRef = doc(db, 'tasks', id);
      await deleteDoc(docRef);

      let localTasks = storage.get(STORAGE_KEYS.TASKS, []);
      localTasks = localTasks.filter((t) => t.id !== id);
      storage.set(STORAGE_KEYS.TASKS, localTasks);

      return { success: true, id };
    } catch (err) {
      console.error('Firestore deleteTask failed:', err);
      throw err;
    }
  }
};
