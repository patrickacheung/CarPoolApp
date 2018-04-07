using CarPoolApp.Libraries;
using CarPoolApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using static CarPoolApp.Libraries.Authentication;

namespace CarPoolApp.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class AuthenticationController : Controller
    {
        public class Account
        {
            public string Username { get; set; }
            public string EmailAddress { get; set; }
            public string Password { get; set; }
            public string PhoneNumber { get; set; }
        }

        private IConfiguration Configuration { get; set; }
        private PersonContext PersonContext { get; set; }

        public AuthenticationController(IConfiguration configuration, PersonContext personContext)
        {
            Configuration = configuration;
            PersonContext = personContext;
        }

        [AllowAnonymous]
        [HttpPost("[action]")]
        public IActionResult Authenticate([FromBody] Account account)
        {
            IActionResult response = Unauthorized();

            Person person = Authentication.GetPerson(PersonContext, account.Username);
            if (person == null || !Authentication.IsPasswordCorrect(person, account.Password))
            {
                return response;
            }

            string token = Authentication.getToken(Configuration, person);
            response = Ok(new { token = token });
            return response;
        }

        [AllowAnonymous]
        [HttpPost("[action]")]
        public IActionResult Register([FromBody] Account account)
        {
            Password password = Authentication.GetNewPassword(account.Password);
            Person person = new Person
            {
                UserName = account.Username,
                Email = account.EmailAddress,
                PasswordHash = password.Hash,
                Salt = password.Salt
            };

            
            Authentication.AddNewUser(PersonContext, person);

            return Ok();
        }
    }
}