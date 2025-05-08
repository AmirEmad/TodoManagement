using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoManagement.Core.Enums;

namespace TodoManagement.Application.DTOs
{
    public class UpdateTodoStatusDto
    {
        [Required]
        public TodoStatus Status { get; set; }
    }
}
