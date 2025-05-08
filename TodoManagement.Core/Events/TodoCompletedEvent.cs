using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TodoManagement.Core.Events
{
    public class TodoCompletedEvent
    {
        public Guid TodoId { get; }
        public DateTime CompletedAt { get; }

        public TodoCompletedEvent(Guid todoId)
        {
            TodoId = todoId;
            CompletedAt = DateTime.UtcNow;
        }
    }
}
