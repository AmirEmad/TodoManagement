using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoManagement.Core.Entities;
using TodoManagement.Core.Enums;

namespace TodoManagement.Core.Interfaces
{
    public interface ITodoRepository
    {
        Task<IEnumerable<Todo>> GetAllAsync();
        Task<IEnumerable<Todo>> GetByStatusAsync(TodoStatus status);
        Task<Todo> GetByIdAsync(Guid id);
        Task<Todo> AddAsync(Todo todo);
        Task UpdateAsync(Todo todo);
        Task DeleteAsync(Guid id);
    }
}
