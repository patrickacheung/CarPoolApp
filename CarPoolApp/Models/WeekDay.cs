using System.Collections.Generic;

namespace CarPoolApp.Models
{
    public class WeekDay
    {
        public int ID { get; set; }
        public string Name { get; set; }

        public List<Occurance> Occurances { get; set; }
    }
}
