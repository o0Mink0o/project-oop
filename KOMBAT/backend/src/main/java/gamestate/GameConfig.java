package gamestate;

import java.io.BufferedReader;
import java.io.FileReader;
import java.io.IOException;
import java.util.HashMap;
import java.util.Map;

public class GameConfig {
    private static GameConfig instance; // Singleton Instance
    private final Map<String, Long> config = new HashMap<>();
    private static final String CONFIG_FILE = "KOMBAT/src/config.txt"; // กำหนดไฟล์คอนฟิก

    // Constructor (private เพื่อบังคับให้ใช้ getInstance())
    private GameConfig() {
        loadConfig();
    }

    // ใช้ Singleton เพื่อให้โหลดไฟล์แค่ครั้งเดียว
    public static GameConfig getInstance() {
        if (instance == null) {
            instance = new GameConfig();
        }
        return instance;
    }

    // อ่านไฟล์คอนฟิก
    private void loadConfig() {
        try (BufferedReader reader = new BufferedReader(new FileReader(CONFIG_FILE))) {
            String line;
            while ((line = reader.readLine()) != null) {
                line = line.trim();
                if (line.isEmpty() || line.startsWith("#")) continue; // ข้ามบรรทัดว่างและคอมเมนต์

                String[] parts = line.split("=");
                if (parts.length == 2) {
                    String key = parts[0].trim();
                    try {
                        long value = Long.parseLong(parts[1].trim());
                        config.put(key, value);
                    } catch (NumberFormatException e) {
                        System.err.println("ค่าของ " + key + " ไม่ใช่ตัวเลขที่ถูกต้อง: " + parts[1]);
                    }
                } else {
                    System.err.println("รูปแบบบรรทัดไม่ถูกต้อง: " + line);
                }
            }
        } catch (IOException e) {
            System.err.println("เกิดข้อผิดพลาดในการอ่านไฟล์: " + e.getMessage());
        }
    }

    // Getter สำหรับดึงค่าคอนฟิก ถ้าไม่มีให้ return defaultValue
    public  long get(String key) {
        return config.get(key);
    }
}