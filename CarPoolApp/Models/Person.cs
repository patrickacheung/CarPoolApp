using System.ComponentModel.DataAnnotations;

namespace CarPoolApp.Models
{
    public class Person
    {
        [Key]
        public int UserID { get; set; }
        public string UserName { get; set; }
        public string PasswordHash { get; set; }
        public string Salt { get; set; }
        public string Email { get; set; }
    }
}
