using Newtonsoft.Json.Linq;

public class OpenCageService
{
    private readonly HttpClient _httpClient;
    private readonly string _apiKey;

    public OpenCageService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _apiKey = configuration["OpenCageApiKey"];
    }

    public async Task<(decimal? Latitude, decimal? Longitude)> GetCoordinatesAsync(string address)
    {
        var url = $"https://api.opencagedata.com/geocode/v1/json?q={address}&key={_apiKey}";
        var response = await _httpClient.GetStringAsync(url);
        var data = JObject.Parse(response);

        var results = data["results"];
        if (results != null && results.HasValues)
        {
            var location = results[0]["geometry"];
            return (location["lat"].Value<decimal>(), location["lng"].Value<decimal>());
        }
        return (null, null);
    }
}
