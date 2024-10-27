using System;
using System.Text.Json;
using System.Text.Json.Serialization;

public class DateOnlyJsonConverter : JsonConverter<DateOnly>
{
    private const string DateFormat = "dd.MM.yyyy";

    public override DateOnly Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        if (reader.TokenType == JsonTokenType.String)
        {
            var dateString = reader.GetString();
            return DateOnly.ParseExact(dateString, DateFormat, null);
        }

        throw new JsonException($"Unexpected token parsing date. Expected string, got {reader.TokenType}.");
    }

    public override void Write(Utf8JsonWriter writer, DateOnly value, JsonSerializerOptions options)
    {
        var dateString = value.ToString(DateFormat);
        writer.WriteStringValue(dateString);
    }
}
