namespace CarPoolApp.Models
{
    public class Occurance
    {
        public int CarPoolID { get; set; }
        public CarPool CarPool { get; set; }

        public int DayID { get; set; }
        public WeekDay WeekDay { get; set; }
    }
}
