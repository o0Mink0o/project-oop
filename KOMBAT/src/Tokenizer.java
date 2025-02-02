import java.util.NoSuchElementException;
import java.util.Set;

class LexicalError extends Exception {
    public LexicalError(String message) {
        super(message);
    }
}

public class Tokenizer {
    private String src, next;
    private int pos;

    // ✅ Reserved Words ที่ห้ามใช้เป็น Identifier
    private static final Set<String> RESERVED_WORDS = Set.of(
            "ally", "done", "down", "downleft", "downright",
            "else", "if", "move", "nearby", "opponent",
            "shoot", "then", "up", "upleft", "upright", "while"
    );

    private static final Set<String> gamestatus_word = Set.of(
            "ally","nearby","opponent","row","col","budget","int","maxbudget","spawnsleft","random"

    );

    public Tokenizer(String src) {
        this.src = src;
        pos = 0;
        try {
            computeNext();
        } catch (LexicalError e) {
            System.err.println(e.getMessage());
        }
    }

    // ✅ ตรวจสอบว่ามี Token ถัดไปหรือไม่
    public boolean hasNextToken() {
        return next != null;
    }

    public void checkNextToken() {
        if (!hasNextToken()) throw new NoSuchElementException("No more tokens");
    }

    public String peek() {
        checkNextToken();
        return next;
    }

    public String consume() {
        checkNextToken();
        String result = next;
        try {
            computeNext();
        } catch (LexicalError e) {
            System.err.println(e.getMessage());
        }
        return result;
    }

    private void computeNext() throws LexicalError {
        StringBuilder s = new StringBuilder();

        // ✅ ข้ามช่องว่าง (Whitespace)
        while (pos < src.length()) {
            if (isSpace(src.charAt(pos))||src.charAt(pos) == '\n') {
                pos++;
            } else if (src.charAt(pos) == '#') { // ✅ ถ้าเจอ `#` ให้ข้ามทั้งบรรทัด
                while (pos < src.length() && src.charAt(pos) != '\n') {
                    pos++;
                }
            } else {
                break;
            }
        }

        if (pos == src.length()) {
            next = null; // หมดโทเคน
            return;
        }

        char c = src.charAt(pos);

        // ✅ อ่านตัวเลข (Number Literal)
        if (isDigit(c)) {
            s.append(c);
            for (pos++; pos < src.length() && isDigit(src.charAt(pos)); pos++) {
                s.append(src.charAt(pos));
            }
        }
        // ✅ อ่านตัวอักษร (Identifiers หรือ Reserved Word)
        else if (isLetter(c)) {
            s.append(c);
            for (pos++; pos < src.length() && isAlphanumeric(src.charAt(pos)); pos++) {
                s.append(src.charAt(pos));
            }
        }
        // ✅ อ่านตัวดำเนินการและเครื่องหมายพิเศษ
        else {
            switch (c) {
                case '+', '-', '*', '/', '%', '(', ')', '{', '}', '=', '^' -> {
                    s.append(c);
                    pos++;
                }
                case '>', '<', '!' -> {  // ✅ รองรับ >, <, >=, <=, ==, !=
                    s.append(c);
                    pos++;
                    if (pos < src.length() && src.charAt(pos) == '=') {
                        s.append('=');
                        pos++;
                    }
                }
                default -> throw new LexicalError("Unknown character: " + c);
            }
        }

        next = s.toString();
    }

    // ✅ เช็คว่า Token เป็น Identifier หรือไม่
    public boolean isIdentifier(String token) {
        if (token == null || token.isEmpty()) return false;
        if (RESERVED_WORDS.contains(token)) return false; // ❌ ห้ามใช้ Reserved Words
        if (!Character.isLetter(token.charAt(0))) return false; // ❌ ต้องขึ้นต้นด้วยตัวอักษร

        // ✅ เช็คว่าอักขระที่เหลือเป็นตัวอักษรหรือตัวเลข
        for (int i = 1; i < token.length(); i++) {
            if (!Character.isLetterOrDigit(token.charAt(i))) {
                return false;
            }
        }
        return true;
    }

    public boolean isGameStatus(String token) {
        if (token == null || token.isEmpty()) return false;
        return gamestatus_word.contains(token);
    }

    public boolean peek(String s) {
        return hasNextToken() && peek().equals(s);
    }

    public void consume(String s) throws SyntaxError {
        if (!peek(s)) {
            throw new SyntaxError("Expected token: " + s);
        }
        consume();
    }

    private boolean isDigit(char c) {
        return c >= '0' && c <= '9';
    }

    private boolean isLetter(char c) {
        return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z');
    }

    private boolean isAlphanumeric(char c) {
        return isLetter(c) || isDigit(c);
    }

    private boolean isSpace(char c) {
        return c == ' ';
    }

    public boolean isNumber(String peek) {
        for (char c : peek.toCharArray()) {
            if(!isDigit(c)) return false;
        }
        return true;
    }
}
