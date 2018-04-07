using System;
using System.Collections.Generic;

namespace CarPoolApp.Models
{
    public class CarPool
    {
        public int ID { get; set; }
        public int DriverID { get; set; }
        public int Seats { get; set; }
        public string CarDescription { get; set; }
        public string StartLocation { get; set; }
        public string EndLocation { get; set; }
        public string AdditionalDetails { get; set; }
        public TimeSpan ArrivalTime { get; set; }

        public List<Occurance> Occurances { get; set; }
    }
}
