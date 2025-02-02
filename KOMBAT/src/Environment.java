import java.util.HashMap;
import java.util.Map;

class Environment {
    private final Map<String, Long> variables = new HashMap<>();

    public void assign(String identifier, long value) {
        variables.put(identifier, value);
    }

    public long get(String identifier) {
        if (!variables.containsKey(identifier)) {
            this.variables.put(identifier, 0L);
            //throw new RuntimeException("Variable not defined: " + identifier);
        }
        return variables.get(identifier);
    }
}