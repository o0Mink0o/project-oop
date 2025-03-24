package gamestate;

import java.util.HashMap;
import java.util.Map;

class Environment {
    private final Map<String, Long> variables = new HashMap<>();

    public void assign(String identifier, long value) {
        if (isGlobal(identifier)) {
            // Global → ต้องมาจากภายนอก ไม่กำหนดที่นี่
            throw new UnsupportedOperationException("Global variables should be assigned via player-level Environment");
        }
        variables.put(identifier, value);
    }

    public long get(String identifier) {
        return variables.getOrDefault(identifier, 0L);
    }

    public void forceAssign(String identifier, long value) {
        // ใช้กับ global environment โดยตรง
        variables.put(identifier, value);
    }

    public boolean contains(String identifier) {
        return variables.containsKey(identifier);
    }

    public static boolean isGlobal(String identifier) {
        if (identifier == null || identifier.isEmpty()) return false;
        return Character.isUpperCase(identifier.charAt(0));
    }
}
