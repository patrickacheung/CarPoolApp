using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using CarPoolApp.Libraries;
using CarPoolApp.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
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

            string token = getToken(person);
            response = Ok(new { token = token });
            HttpContext.Session.SetString(token, person.UserName);
            return response;
        }

        [HttpGet("[action]")]
        public async Task<IActionResult> Test()
        {
            string token = await HttpContext.GetTokenAsync("access_token");
            return Ok(new { UserName = HttpContext.Session.GetString(token) });
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

        private string getToken(Person person)
        {
            Claim[] claims = new []
            {
                new Claim(JwtRegisteredClaimNames.Sub, person.UserName),
                new Claim(JwtRegisteredClaimNames.Email, person.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Jwt:Key"]));
            SigningCredentials creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            JwtSecurityToken token = new JwtSecurityToken(Configuration["Jwt:Issuer"], Configuration["Jwt:Issuer"], claims, expires: DateTime.Now.AddMinutes(30), signingCredentials: creds);
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}