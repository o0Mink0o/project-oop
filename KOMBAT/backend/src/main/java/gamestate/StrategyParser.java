package gamestate;

import java.util.ArrayList;
import java.util.List;

public class StrategyParser {
    private final Tokenizer tokenizer;

    public StrategyParser(Tokenizer tokenizer) {
        this.tokenizer = tokenizer;
    }

    public static boolean validate(String strategyText) {
        try {
            StrategyParser parser = new StrategyParser(new Tokenizer(strategyText));
            parser.parse(); // ถ้า syntax ถูกต้อง จะไม่มี exception
            return true;
        } catch (SyntaxError e) {
            System.err.println("❌ Syntax Error: " + e.getMessage());
        } catch (Exception e) {
            System.err.println("❌ Unexpected Error: " + e.getMessage());
        }
        return false;
    }

    public Strategy parse() throws SyntaxError {
        List<Statement> statements = new ArrayList<>();
        while (tokenizer.hasNextToken()) {
            statements.add(parseStatement());
        }
        return new Strategy(statements);
    }

    private Statement parseStatement() throws SyntaxError {
        if (tokenizer.peek("if")) {
            return parseIfStatement();
        } else if (tokenizer.peek("while")) {
            return parseWhileStatement();
        } else if (tokenizer.peek("{")) {
            return parseBlockStatement();
        } else if (tokenizer.peek("done")) {
            return ParseDoneCommand();
        } else if (tokenizer.peek("move")) {
            return parseMoveCommand();
        } else if (tokenizer.peek("shoot")) {
            return parseAttackCommand();
        } else if (tokenizer.isIdentifier(tokenizer.peek())) {
            return parseAssignmentStatement();
        } else {
            throw new SyntaxError("Unexpected token: " + tokenizer.peek());
        }
    }

    private DoneStatement ParseDoneCommand() throws SyntaxError{
        tokenizer.consume("done");
        return new DoneStatement();
    }

    private AssignmentStatement parseAssignmentStatement() throws SyntaxError {
        String identifier = tokenizer.consume();
        tokenizer.consume("="); // Expect '='
        Expression expression = parseExpression();
        return new AssignmentStatement(identifier, expression);
    }

    private MoveCommand parseMoveCommand() throws SyntaxError {
        tokenizer.consume("move");
        String direction = tokenizer.consume();
        return new MoveCommand(direction);
    }

    private AttackCommand parseAttackCommand() throws SyntaxError {
        tokenizer.consume("shoot");
        String direction = tokenizer.consume();
        Expression power = parseExpression();
        return new AttackCommand(direction, power);
    }

    private BlockStatement parseBlockStatement() throws SyntaxError {
        tokenizer.consume("{");
        List<Statement> statements = new ArrayList<>();
        while (!tokenizer.peek("}")) {
            statements.add(parseStatement());
        }
        tokenizer.consume("}");
        return new BlockStatement(statements);
    }

    private IfStatement parseIfStatement() throws SyntaxError {
        tokenizer.consume("if");
        tokenizer.consume("(");
        Expression condition = parseExpression();
        tokenizer.consume(")");
        tokenizer.consume("then");
        Statement thenBranch = parseStatement();
        tokenizer.consume("else");
        Statement elseBranch = parseStatement();
        return new IfStatement(condition, thenBranch, elseBranch);
    }

    private WhileStatement parseWhileStatement() throws SyntaxError {
        tokenizer.consume("while");
        tokenizer.consume("(");
        Expression condition = parseExpression();
        tokenizer.consume(")");
        Statement body = parseStatement();
        return new WhileStatement(condition, body);
    }

    private Expression parseExpression() throws SyntaxError {
        Expression left = parseTerm();
        while (tokenizer.peek("+") || tokenizer.peek("-")) {
            String op = tokenizer.consume();
            Expression right = parseTerm();
            left = new BinaryExpression(op, left, right);
        }
        return left;
    }

    private Expression parseTerm() throws SyntaxError {
        Expression left = parseFactor();
        while (tokenizer.peek("*") || tokenizer.peek("/") || tokenizer.peek("%")|| tokenizer.peek("^")) {
            String op = tokenizer.consume();
            Expression right = parseFactor();
            left = new BinaryExpression(op, left, right);
        }
        return left;
    }

    private Expression parseFactor() throws SyntaxError {
        if (tokenizer.isNumber(tokenizer.peek())) {
            return new NumberLiteral(Long.parseLong(tokenizer.consume()));
        } else if (tokenizer.isIdentifier(tokenizer.peek())) {
            return new Variable(tokenizer.consume());
        } else if (tokenizer.isGameStatus(tokenizer.peek())) {
            if(tokenizer.peek().equals("nearby")){
                return new gameStatus(tokenizer.consume(),tokenizer.consume());
            }
            return new gameStatus(tokenizer.consume());
        } else if (tokenizer.peek("(")) {
            tokenizer.consume("(");
            Expression expr = parseExpression();
            tokenizer.consume(")");
            return expr;
        } else {
            throw new SyntaxError("Unexpected token: " + tokenizer.peek());
        }
    }
}