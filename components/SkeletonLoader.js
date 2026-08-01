/* ==========================================================================
   TaskFlow Skeleton Loader Component
   ========================================================================== */

export const SkeletonLoader = {
  renderKanbanSkeleton() {
    const skeletonCard = `
      <div class="card skeleton-card" style="padding: 1rem; border-radius: var(--radius-lg); background: var(--bg-card); margin-bottom: 0.875rem;">
        <div class="skeleton" style="height: 16px; width: 70%; margin-bottom: 0.75rem;"></div>
        <div class="skeleton" style="height: 12px; width: 95%; margin-bottom: 0.5rem;"></div>
        <div class="skeleton" style="height: 12px; width: 50%; margin-bottom: 1rem;"></div>
        <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 0.75rem; border-top: 1px solid var(--border-subtle);">
          <div class="skeleton" style="height: 20px; width: 60px; border-radius: 99px;"></div>
          <div class="skeleton" style="height: 24px; width: 24px; border-radius: 50%;"></div>
        </div>
      </div>
    `;

    return `
      <div class="kanban-board">
        ${['Todo', 'In Progress', 'Done'].map(column => `
          <div class="kanban-column">
            <div class="column-header">
              <div class="skeleton" style="height: 20px; width: 100px;"></div>
              <div class="skeleton" style="height: 18px; width: 28px; border-radius: 99px;"></div>
            </div>
            <div class="task-list">
              ${skeletonCard}
              ${skeletonCard}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  },

  renderTableSkeleton() {
    return `
      <div class="task-table-wrapper">
        <table class="task-table">
          <thead>
            <tr>
              <th>Task Title</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Assignee</th>
              <th>Due Date</th>
            </tr>
          </thead>
          <tbody>
            ${Array(4).fill(0).map(() => `
              <tr>
                <td><div class="skeleton" style="height: 16px; width: 180px;"></div></td>
                <td><div class="skeleton" style="height: 20px; width: 70px; border-radius: 99px;"></div></td>
                <td><div class="skeleton" style="height: 20px; width: 60px; border-radius: 99px;"></div></td>
                <td><div class="skeleton" style="height: 24px; width: 24px; border-radius: 50%;"></div></td>
                <td><div class="skeleton" style="height: 14px; width: 80px;"></div></td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
  }
};
