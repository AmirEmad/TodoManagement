using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoManagement.Core.Enums;

namespace TodoManagement.Application.DTOs
{
    public class CreateTodoDto
    {
        [Required]
        [StringLength(100)]
        public string Title { get; set; }

        public string Description { get; set; }

        [Required]
        public TodoPriority Priority { get; set; }

        public DateTime? DueDate { get; set; }
    }
}
