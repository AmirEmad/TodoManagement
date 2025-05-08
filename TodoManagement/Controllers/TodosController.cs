using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TodoManagement.Application.DTOs;
using TodoManagement.Application.Services.Interfaces;
using TodoManagement.Core.Enums;

namespace TodoManagement.APi.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TodosController : ControllerBase
    {
        private readonly ITodoService _todoService;

        public TodosController(ITodoService todoService)
        {
            _todoService = todoService;
        }

        // GET: api/todos
        [HttpGet]
        public async Task<ActionResult<IEnumerable<TodoDto>>> GetTodos([FromQuery] string status = null)
        {
            if (string.IsNullOrEmpty(status))
            {
                var todos = await _todoService.GetAllTodosAsync();
                return Ok(todos);
            }

            if (!Enum.TryParse<TodoStatus>(status, true, out var todoStatus))
            {
                return BadRequest("Invalid status value. Valid values are: Pending, InProgress, Completed");
            }

            var filteredTodos = await _todoService.GetTodosByStatusAsync(todoStatus);
            return Ok(filteredTodos);
        }

        // GET: api/todos/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<TodoDto>> GetTodo(Guid id)
        {
            var todo = await _todoService.GetTodoByIdAsync(id);

            if (todo == null)
            {
                return NotFound();
            }

            return Ok(todo);
        }

        // POST: api/todos
        [HttpPost]
        public async Task<ActionResult<TodoDto>> CreateTodo(CreateTodoDto createTodoDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var createdTodo = await _todoService.CreateTodoAsync(createTodoDto);
            return CreatedAtAction(nameof(GetTodo), new { id = createdTodo.Id }, createdTodo);
        }

        // PUT: api/todos/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateTodo(Guid id, UpdateTodoDto updateTodoDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var updatedTodo = await _todoService.UpdateTodoAsync(id, updateTodoDto);

            if (updatedTodo == null)
            {
                return NotFound();
            }

            return Ok(updatedTodo);
        }

        // PATCH: api/todos/{id}/status
        [HttpPatch("{id}/status")]
        public async Task<IActionResult> UpdateTodoStatus(Guid id, UpdateTodoStatusDto updateStatusDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var updatedTodo = await _todoService.UpdateTodoStatusAsync(id, updateStatusDto);

            if (updatedTodo == null)
            {
                return NotFound();
            }

            return Ok(updatedTodo);
        }

        // POST: api/todos/{id}/complete
        [HttpPost("{id}/complete")]
        public async Task<IActionResult> CompleteTodo(Guid id)
        {
            var completedTodo = await _todoService.MarkTodoAsCompleteAsync(id);

            if (completedTodo == null)
            {
                return NotFound();
            }

            return Ok(completedTodo);
        }

        // DELETE: api/todos/{id}
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTodo(Guid id)
        {
            var result = await _todoService.DeleteTodoAsync(id);

            if (!result)
            {
                return NotFound();
            }

            return NoContent();
        }
    }
}
