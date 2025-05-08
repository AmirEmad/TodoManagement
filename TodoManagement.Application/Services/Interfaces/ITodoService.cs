using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoManagement.Application.DTOs;
using TodoManagement.Core.Enums;

namespace TodoManagement.Application.Services.Interfaces
{
    public interface ITodoService
    {
        Task<IEnumerable<TodoDto>> GetAllTodosAsync();
        Task<IEnumerable<TodoDto>> GetTodosByStatusAsync(TodoStatus status);
        Task<TodoDto> GetTodoByIdAsync(Guid id);
        Task<TodoDto> CreateTodoAsync(CreateTodoDto createTodoDto);
        Task<TodoDto> UpdateTodoAsync(Guid id, UpdateTodoDto updateTodoDto);
        Task<TodoDto> UpdateTodoStatusAsync(Guid id, UpdateTodoStatusDto updateStatusDto);
        Task<bool> DeleteTodoAsync(Guid id);
        Task<TodoDto> MarkTodoAsCompleteAsync(Guid id);
    }
}
