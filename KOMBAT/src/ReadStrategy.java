import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.io.BufferedReader;
import java.io.IOException;

class EmptyFileException extends Exception {
    public EmptyFileException(String message) {
        super(message);
    }
}


public class ReadStrategy {



    public static void readfile(String filepath)  {
        Path file = Paths.get(filepath);
        Charset charset = StandardCharsets.UTF_8;

        try {
            if (Files.size(file) == 0) {
                throw new EmptyFileException("The file is empty: " + filepath);
            }}catch (EmptyFileException | IOException x){
            System.out.println("Exception: "+x.getMessage());
        }
        try (BufferedReader reader = Files.newBufferedReader(file, charset)) {
            String line = null;
            StringBuilder stringBuilder = new StringBuilder();
            while ((line = reader.readLine()) != null) {
                if (line.trim().isEmpty()) {
                    continue;
                }
                stringBuilder.append(line);
            }
            try{
                Strategy ast = safeParse(stringBuilder.toString());

            }catch (Exception e){
                System.out.println("Exception: "+e.getMessage()+line.trim());
            }
        } catch (IOException x) {
            System.err.println("Error reading file or Emtpy file");
        }
    }

    private static Strategy safeParse(String input) {
        try {
            return new StrategyParser(new Tokenizer(input)).parse();
        } catch (SyntaxError e) {
            throw new AssertionError("Unexpected SyntaxError: " + e.getMessage(), e);
        }
    }


}