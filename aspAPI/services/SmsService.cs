using Vonage;
using Vonage.Request;
using Vonage.Messaging;
using System.Threading.Tasks;
using Microsoft.AspNetCore.DataProtection;
using System;
using System.Threading.Tasks;

namespace aspAPI.services
{
 

    public class SmsService
    {
        private readonly string apiKey = "6d965815";    
        private readonly string apiSecret = "yA7fq9U6zkML84az"; 

        public SmsService()
        {
            
        }

        public async Task SendSmsAsync(string toPhoneNumber, string messageText)
        {
            var credentials = Credentials.FromApiKeyAndSecret(apiKey, apiSecret);
            var client = new VonageClient(credentials);

            try
            {
                var response = await client.SmsClient.SendAnSmsAsync(new SendSmsRequest
                {
                    To = toPhoneNumber,
                    From = "integrateVonage",  
                    Text = messageText
                });

                if (response.Messages[0].Status == "0")
                {
                    Console.WriteLine("Message sent successfully!");
                }
                else
                {
                    Console.WriteLine($"Failed to send message: {response.Messages[0].ErrorText}");
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error: {ex.Message}");
            }
        }
    }



}
