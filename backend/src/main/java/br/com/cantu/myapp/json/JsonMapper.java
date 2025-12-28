package br.com.cantu.myapp.json;

import br.com.cantu.myapp.exception.ParseException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule;
import lombok.Getter;
import org.springframework.stereotype.Component;

@Component
@Getter
public class JsonMapper {

    private final ObjectMapper mapper;

    public JsonMapper() {
        mapper = new ObjectMapper();
        mapper.registerModule(new JavaTimeModule()); // Suporte a LocalDate, LocalDateTime, etc.
        mapper.disable(SerializationFeature.WRITE_DATES_AS_TIMESTAMPS);
    }

    public String writeValueAsString(Object value) {
        try {
            return mapper.writeValueAsString(value);
        } catch (JsonProcessingException e) {
            throw new ParseException(e);
        }
    }

    public <T> T readValue(String content, Class<T> valueType) {
        try {
            return mapper.readValue(content, valueType);
        } catch (JsonProcessingException e) {
            throw new ParseException(e);
        }
    }

    public <T> T readValue(String content, TypeReference<T> valueTypeRef) {
        try {
            return mapper.readValue(content, valueTypeRef);
        } catch (JsonProcessingException e) {
            throw new ParseException(e);
        }
    }

}
