using System;
using System.Collections.Generic;
using System.Globalization;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;

// For more information on enabling MVC for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MFEC_Assignment.Controllers
{
    [Route("api/[controller]")]
    public class PromotionController : Controller
    {

        [HttpGet("[action]")]
        public IEnumerable<CustomerLog> GetLogData()
        {
            var groupedCustomerList = ReadData()
            .GroupBy(u => u.ModileNumber)
            .Select(g => new CustomerLog
            {
                ModileNumber = g.Key,
                TotalTime = g.Sum(t => t.TotalTime),
                ServiceFee = g.Sum(s => s.ServiceFee),
                Promotion = g.First().Promotion,
                DateFormatted = g.First().DateFormatted
            })
            .ToList();
            var n = groupedCustomerList.Count;
            return Enumerable.Range(1, n).Select(index => groupedCustomerList[index-1]);
        }
        [HttpPost("[action]")]
        public IEnumerable<CustomerLog> GetLogDataByNumber([FromBody]Number Number)
        {
            var groupedCustomerList = ReadData()
            .Where(s => s.ModileNumber.Equals(Number.ModileNumber))
            .Select(g => new CustomerLog
            {
                ModileNumber = g.ModileNumber,
                TotalTime = g.TotalTime,
                ServiceFee = g.ServiceFee,
                Promotion = g.Promotion,
                DateFormatted = g.DateFormatted,
                StartTime = g.StartTime,
                EndTime = g.EndTime
            })
            .ToList();
             
            var n = groupedCustomerList.Count;
            return Enumerable.Range(1, n).Select(index => groupedCustomerList[index - 1]);
        }
        private List<CustomerLog> ReadData()
        {
            var DataLog = System.IO.File.ReadAllLines(Path.Combine("", "data.json"));
            List<CustomerLog> customerLogs = new List<CustomerLog>();
            foreach (var log in DataLog)
            {
                CustomerLog customer = new CustomerLog();
                string[] data = log.Split('|');
                int i = 0;
                double ServiceFee = 0;
                customer.DateFormatted = data[i++];
                customer.StartTime = DateTime.ParseExact(customer.DateFormatted + " " + data[i++], "dd/MM/yyyy HH:mm:ss", CultureInfo.InvariantCulture);
                customer.EndTime = DateTime.ParseExact(customer.DateFormatted + " " + data[i++], "dd/MM/yyyy HH:mm:ss", CultureInfo.InvariantCulture);
                var diff = customer.EndTime - customer.StartTime;
                if (diff.Minutes == 0 && diff.Seconds > 0 && diff.Hours == 0)
                {
                    ServiceFee = 3d;
                }
                else ServiceFee = 3d + (diff.Hours * 60d) + diff.Minutes + ((1 / 60d) * diff.Seconds) - 1d;

                customer.ServiceFee = ServiceFee;
                customer.TotalTime = (diff.Hours * 60) + diff.Minutes;
                customer.ModileNumber = data[i++];
                customer.Promotion = data[i++]; ;
                customerLogs.Add(customer);
            }
            return customerLogs;
        }
        public class Number
        {
            public string ModileNumber { get; set; }
        }
        public class CustomerLog
        {
            public string DateFormatted { get; set; }
            public DateTime StartTime { get; set; }
            public DateTime EndTime { get; set; }
            public int TotalTime { get; set; }
            public double ServiceFee { get; set; }
            public string ModileNumber { get; set; }
            public string Promotion { get; set; }
        }
    }
}
