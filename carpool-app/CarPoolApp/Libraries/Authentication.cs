﻿using CarPoolApp.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;

namespace CarPoolApp.Libraries
{
    public class Authentication
    {
        public class Password
        {
            public string Hash { get; }
            public string Salt { get; }

            public Password(string hash, string salt)
            {
                Hash = hash;
                Salt = salt;
            }
        }

        private static int NUM_BYTES_IN_SALT = 16;
        private static int NUM_BYTES_IN_HASH = 32;
        private static int ITERATION_COUNT = 1000;

        public static string GetPasswordHash(string salt, string password)
        {
            byte[] saltBytes = Convert.FromBase64String(salt);
            byte[] passwordHashBytes = KeyDerivation.Pbkdf2(password, saltBytes, KeyDerivationPrf.HMACSHA1, ITERATION_COUNT, NUM_BYTES_IN_HASH);
            return Convert.ToBase64String(passwordHashBytes);
        }

        public static Password GetNewPassword(string password)
        {
            byte[] salt = new byte[NUM_BYTES_IN_SALT];
            using (RandomNumberGenerator randomNumberGenerator = RandomNumberGenerator.Create())
            {
                randomNumberGenerator.GetBytes(salt);
            }

            string saltString = Convert.ToBase64String(salt);
            string passwordHash = GetPasswordHash(saltString, password);
            return new Password(passwordHash, saltString);
        }
        
        public static bool IsPasswordCorrect(Person person, string password)
        {
            string givenPasswordHash = GetPasswordHash(person.Salt, password);
            return givenPasswordHash.Equals(person.PasswordHash);
        }

        public static void AddNewUser(PersonContext personContext, Person person)
        {
            personContext.Database.EnsureCreated();
            personContext.Persons.Add(person);
            personContext.SaveChanges();
        }

        public static Person GetPerson(PersonContext personContext, string username)
        {
            personContext.Database.EnsureCreated();
            Person person = personContext.Persons.Where(p => p.UserName.Equals(username)).FirstOrDefault<Person>();
            return person;
        }

        public static string getUserName(HttpContext context)
        {
            string tokenString = AuthenticationHttpContextExtensions.GetTokenAsync(context, "access_token").Result;
            JwtSecurityTokenHandler handler = new JwtSecurityTokenHandler();
            JwtSecurityToken token = handler.ReadJwtToken(tokenString);
            return token.Subject;
        }

        public static string getToken(IConfiguration configuration, Person person)
        {
            Claim[] claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, person.UserName),
                new Claim(JwtRegisteredClaimNames.Email, person.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            SymmetricSecurityKey key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["Jwt:Key"]));
            SigningCredentials creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
            JwtSecurityToken token = new JwtSecurityToken(configuration["Jwt:Issuer"], configuration["Jwt:Issuer"], claims, expires: DateTime.Now.AddMinutes(30), signingCredentials: creds);
            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
