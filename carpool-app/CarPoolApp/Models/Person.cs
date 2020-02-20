using System.ComponentModel.DataAnnotations;

namespace CarPoolApp.Models
{
    public class Person
    {
        [Key]
        public int ID { get; set; }
        public string UserName { get; set; }
        public string PasswordHash { get; set; }
        public string Salt { get; set; }
        public string Email { get; set; }
    }
}
