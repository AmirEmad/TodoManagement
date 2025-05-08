using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoManagement.Application.DTOs;
using TodoManagement.Application.Services.Interfaces;
using TodoManagement.Core.Entities;
using TodoManagement.Core.Enums;
using TodoManagement.Core.Interfaces;

namespace TodoManagement.Application.Services
{
    public class TodoService : ITodoService
    {
        private readonly ITodoRepository _todoRepository;

        public TodoService(ITodoRepository todoRepository)
        {
            _todoRepository = todoRepository;
        }

        public async Task<IEnumerable<TodoDto>> GetAllTodosAsync()
        {
            var todos = await _todoRepository.GetAllAsync();
            return todos.Select(MapToDto);
        }

        public async Task<IEnumerable<TodoDto>> GetTodosByStatusAsync(TodoStatus status)
        {
            var todos = await _todoRepository.GetByStatusAsync(status);
            return todos.Select(MapToDto);
        }

        public async Task<TodoDto> GetTodoByIdAsync(Guid id)
        {
            var todo = await _todoRepository.GetByIdAsync(id);
            return todo != null ? MapToDto(todo) : null;
        }

        public async Task<TodoDto> CreateTodoAsync(CreateTodoDto createTodoDto)
        {
            var todo = new Todo
            {
                Title = createTodoDto.Title,
                Description = createTodoDto.Description,
                Priority = createTodoDto.Priority,
                DueDate = createTodoDto.DueDate
            };

            var createdTodo = await _todoRepository.AddAsync(todo);
            return MapToDto(createdTodo);
        }

        public async Task<TodoDto> UpdateTodoAsync(Guid id, UpdateTodoDto updateTodoDto)
        {
            var todo = await _todoRepository.GetByIdAsync(id);
            if (todo == null)
                return null;

            todo.Update(
                updateTodoDto.Title,
                updateTodoDto.Description,
                updateTodoDto.Priority,
                updateTodoDto.DueDate
            );

            await _todoRepository.UpdateAsync(todo);
            return MapToDto(todo);
        }

        public async Task<TodoDto> UpdateTodoStatusAsync(Guid id, UpdateTodoStatusDto updateStatusDto)
        {
            var todo = await _todoRepository.GetByIdAsync(id);
            if (todo == null)
                return null;

            todo.UpdateStatus(updateStatusDto.Status);
            await _todoRepository.UpdateAsync(todo);

            // If status is set to completed, trigger domain event (optional)
            if (updateStatusDto.Status == TodoStatus.Completed)
            {
                // In a real application with event dispatching system:
                // _eventDispatcher.Dispatch(new TodoCompletedEvent(todo.Id));
            }

            return MapToDto(todo);
        }

        public async Task<bool> DeleteTodoAsync(Guid id)
        {
            var todo = await _todoRepository.GetByIdAsync(id);
            if (todo == null)
                return false;

            await _todoRepository.DeleteAsync(id);
            return true;
        }

        public async Task<TodoDto> MarkTodoAsCompleteAsync(Guid id)
        {
            var todo = await _todoRepository.GetByIdAsync(id);
            if (todo == null)
                return null;

            todo.MarkAsComplete();
            await _todoRepository.UpdateAsync(todo);

            // In a real application with event dispatching system:
            // _eventDispatcher.Dispatch(new TodoCompletedEvent(todo.Id));

            return MapToDto(todo);
        }

        private static TodoDto MapToDto(Todo todo)
        {
            return new TodoDto
            {
                Id = todo.Id,
                Title = todo.Title,
                Description = todo.Description,
                Status = todo.Status.ToString(),
                Priority = todo.Priority.ToString(),
                DueDate = todo.DueDate,
                CreatedDate = todo.CreatedDate,
                LastModifiedDate = todo.LastModifiedDate
            };
        }
    }
}
