using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CarPoolApp.Controllers
{
    [Produces("application/json")]
    [Route("api/CreateCarpool")]
    public class CreateCarpoolController : Controller
    {
        [HttpGet]
        public int simple()
        {
            return 5555;
        }

    }
}


