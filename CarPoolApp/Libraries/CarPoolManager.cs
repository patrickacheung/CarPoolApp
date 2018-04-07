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
            CarPool carPool = getCarPoolFromInfo(carPoolInfo, person.ID);
            List<WeekDay> weekDays = getWeekDays(carPoolContext, carPoolInfo.WeekDays);
            List<Occurance> occurances = GetOccurances(carPool, weekDays);
            carPool.Occurances = occurances;
            weekDays.ForEach(w => w.Occurances = occurances.Where(o => o.DayID == w.ID).ToList());

            carPoolContext.Database.EnsureCreated();
            carPoolContext.CarPools.Add(carPool);
            carPoolContext.WeekDays.AttachRange(weekDays);
            carPoolContext.SaveChanges();
        }

        public static List<CarPoolInfo> getCarPoolInfos(CarPoolContext carPoolContext, PersonContext personContext)
        {
            carPoolContext.Database.EnsureCreated();
            List<CarPool> carPools = carPoolContext.CarPools.ToList();
            List<CarPoolInfo> carPoolInfos = carPools.Select(c => getCarPoolInfoBase(carPoolContext, personContext, c)).ToList();
            return carPoolInfos;
        }

        private static string getDriverName(PersonContext personContext, int personID)
        {
            Person person = personContext.Persons.Where(p => p.ID == personID).FirstOrDefault();
            return person.UserName;
        }

        private static List<string> getWeekDays(CarPoolContext carPoolContext, int carPoolID)
        {
            Occurance[] occurances = carPoolContext.Occurances.Where(o => o.CarPoolID == carPoolID).ToArray();
            List<WeekDay> weekDays = new List<WeekDay>();
            for (int i = 0; i < occurances.Length; i++)
            {
                weekDays.AddRange(carPoolContext.WeekDays.Where(w => w.ID == occurances[i].DayID));
            }

            return weekDays.Select(w => w.Name).ToList();
        }

        private static CarPoolInfo getCarPoolInfoBase(CarPoolContext carPoolContext, PersonContext personContext, CarPool carPool)
        {
            CarPoolInfo carPoolInfo = new CarPoolInfo
            {
                Driver = getDriverName(personContext, carPool.DriverID),
                CarDescription = carPool.CarDescription,
                AdditionalDetails = carPool.AdditionalDetails,
                StartLocation = carPool.StartLocation,
                EndLocation = carPool.EndLocation,
                Seats = carPool.Seats,
                Time = carPool.ArrivalTime.ToString(),
                WeekDays = getWeekDays(carPoolContext, carPool.ID)
            };

            return carPoolInfo;
        }

        private static CarPool getCarPoolFromInfo(CarPoolInfo carPoolInfo, int personId)
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
