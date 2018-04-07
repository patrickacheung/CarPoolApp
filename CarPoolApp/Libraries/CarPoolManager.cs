using CarPoolApp.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using static CarPoolApp.Controllers.CarpoolController;

namespace CarPoolApp.Libraries
{
    public class CarPoolManager
    {
        public static void AddNewCarPool(CarPoolInfo carPoolInfo, Person person, CarPoolContext carPoolContext)
        {
            CarPool carPool = getCarPool(carPoolInfo, person.ID);
            List<WeekDay> weekDays = getWeekDays(carPoolContext, carPoolInfo.WeekDays);
            List<Occurance> occurances = GetOccurances(carPool, weekDays);
            carPool.Occurances = occurances;
            weekDays.ForEach(w => w.Occurances = occurances.Where(o => o.DayID == w.ID).ToList());

            carPoolContext.Database.EnsureCreated();
            carPoolContext.CarPools.Add(carPool);
            carPoolContext.WeekDays.AttachRange(weekDays);
            carPoolContext.SaveChanges();
        }

        private static CarPool getCarPool(CarPoolInfo carPoolInfo, int personId)
        {
            CarPool carPool = new CarPool
            {
                DriverID = personId,
                CarDescription = carPoolInfo.CarDescription,
                AdditionalDetails = carPoolInfo.AdditionalDetails,
                StartLocation = carPoolInfo.StartLocation,
                EndLocation = carPoolInfo.EndLocation,
                Seats = carPoolInfo.Seats,
                ArrivalTime = TimeSpan.Parse(carPoolInfo.Time)
            };

            return carPool;
        }

        private static List<WeekDay> getWeekDays(CarPoolContext carPoolContext, List<string> weekDayNames)
        {
            List<WeekDay> weekDays = new List<WeekDay>();
            foreach (string weekDayName in weekDayNames)
            {
                weekDays.AddRange(carPoolContext.WeekDays.Where(w => w.Name.Equals(weekDayName)));
            }

            return weekDays;
        }

        private static List<Occurance> GetOccurances(CarPool carPool, List<WeekDay> weekDays)
        {
            List<Occurance> occurances = new List<Occurance>();
            foreach (WeekDay weekDay in weekDays)
            {
                Occurance occurance = new Occurance { CarPool = carPool, WeekDay = weekDay, DayID = weekDay.ID };
                occurances.Add(occurance);
            }

            return occurances;
        }
    }
}
