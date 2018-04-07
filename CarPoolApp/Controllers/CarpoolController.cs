using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using CarPoolApp.Libraries;
using CarPoolApp.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;

namespace CarPoolApp.Controllers
{
    [Authorize]
    [Produces("application/json")]
    [Route("api/[controller]")]
    public class CarpoolController : Controller
    {
        public class CarPoolInfo
        {
            public string Driver { get; set; }
            public int Seats { get; set; }
            public string CarDescription { get; set; }
            public string StartLocation { get; set; }
            public string EndLocation { get; set; }
            public List<string> WeekDays { get; set; }
            public string Time { get; set; }
            public string AdditionalDetails { get; set; }
        }

        private IConfiguration Configuration { get; set; }
        private CarPoolContext CarPoolContext { get; set; }
        private PersonContext PersonContext { get; set; }

        public CarpoolController(IConfiguration configuration, PersonContext personContext, CarPoolContext carPoolContext)
        {
            Configuration = configuration;
            CarPoolContext = carPoolContext;
            PersonContext = personContext;
        }

        [HttpPost("[action]")]
        public IActionResult Add([FromBody] CarPoolInfo carPoolInfo)
        {
            string username = Authentication.getUserName(HttpContext);
            Person person = Authentication.GetPerson(PersonContext, username);
            CarPoolManager.AddNewCarPool(carPoolInfo, person, CarPoolContext);
            return Ok();
        }

        [HttpGet("[action]")]
        [AllowAnonymous]
        public IActionResult Get([FromQuery(Name = "param")] string paramString)
        {
            List<CarPoolInfo> carPoolInfos = CarPoolManager.getCarPoolInfos(CarPoolContext, PersonContext);
            if (paramString == null)
            {
                return Ok(carPoolInfos);
            }

            CarPoolInfo param = JsonConvert.DeserializeObject<CarPoolInfo>(paramString);
            if (param.Driver != null)
            {
                carPoolInfos.RemoveAll(c => !c.Driver.Equals(param.Driver));
            }

            if (param.EndLocation != null)
            {
                carPoolInfos.RemoveAll(c => !c.EndLocation.Equals(param.EndLocation));
            }

            if (param.WeekDays != null)
            {
                carPoolInfos.RemoveAll(c => !param.WeekDays.Except(c.WeekDays).Any());
            }

            if (param.Time != null)
            {
                TimeSpan wantedArrivalTime = TimeSpan.Parse(param.Time);
                carPoolInfos.RemoveAll(c => wantedArrivalTime.CompareTo(TimeSpan.Parse(c.Time)) >= 0);
            }

            return Ok(carPoolInfos);
        }

        [HttpPost("[action]")]
        public IActionResult Email([FromBody] CarPoolInfo carPoolInfo)
        {
            Person driver = PersonContext.Persons.Where(p => p.UserName.Equals(carPoolInfo.Driver)).FirstOrDefault();
            Person passenger = Authentication.GetPerson(PersonContext, Authentication.getUserName(HttpContext));
            SendEmail(driver, passenger, carPoolInfo);
            return Ok();
        }

        private void SendEmail(Person driver, Person passenger, CarPoolInfo carPoolInfo)
        {
            SmtpClient client = new SmtpClient(Configuration["Email:Smtp"], int.Parse(Configuration["Email:Port"]))
            {
                UseDefaultCredentials = false,
                EnableSsl = true,
                Credentials = new NetworkCredential(Configuration["Email:Address"], Configuration["Email:Password"])
            };

            MailMessage mailMessage = new MailMessage
            {
                From = new MailAddress(Configuration["Email:Address"])
            };

            mailMessage.To.Add(driver.Email);
            mailMessage.CC.Add(passenger.Email);
            mailMessage.Body = JsonConvert.SerializeObject(carPoolInfo);
            mailMessage.Subject = "Car Pool Request";
            client.Send(mailMessage);
        }
    }
}


