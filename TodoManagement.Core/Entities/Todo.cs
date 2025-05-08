using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using TodoManagement.Core.Enums;

namespace TodoManagement.Core.Entities
{
    public class Todo
    {
        public Guid Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Title { get; set; }

        public string Description { get; set; }

        public TodoStatus Status { get; set; }

        public TodoPriority Priority { get; set; }

        public DateTime? DueDate { get; set; }

        public DateTime CreatedDate { get; set; }

        public DateTime LastModifiedDate { get; set; }

        // Constructor
        public Todo()
        {
            Id = Guid.NewGuid();
            Status = TodoStatus.Pending;
            Priority = TodoPriority.Medium;
            CreatedDate = DateTime.UtcNow;
            LastModifiedDate = DateTime.UtcNow;
        }

        // Domain methods
        public void MarkAsComplete()
        {
            Status = TodoStatus.Completed;
            LastModifiedDate = DateTime.UtcNow;
        }

        public void UpdateStatus(TodoStatus newStatus)
        {
            Status = newStatus;
            LastModifiedDate = DateTime.UtcNow;
        }

        public void Update(string title, string description, TodoPriority priority, DateTime? dueDate)
        {
            Title = title;
            Description = description;
            Priority = priority;
            DueDate = dueDate;
            LastModifiedDate = DateTime.UtcNow;
        }
    }
}
