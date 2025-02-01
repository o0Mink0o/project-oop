import java.util.List;

// --- AST Node หลัก ---
abstract class Statement {}

abstract class Expression {}

// ✅ Strategy (โปรแกรมหลัก)
class Strategy {
    List<Statement> statements;

    public Strategy(List<Statement> statements) {
        this.statements = statements;
    }
}

// ✅ Statement ประเภทต่างๆ
class AssignmentStatement extends Statement {
    String identifier;
    Expression expression;

    public AssignmentStatement(String identifier, Expression expression) {
        this.identifier = identifier;
        this.expression = expression;
    }
}

class MoveCommand extends Statement {
    String direction;

    public MoveCommand(String direction) {
        this.direction = direction;
    }
}

class AttackCommand extends Statement {
    String direction;
    Expression power;

    public AttackCommand(String direction, Expression power) {
        this.direction = direction;
        this.power = power;
    }
}

class BlockStatement extends Statement {
    List<Statement> statements;

    public BlockStatement(List<Statement> statements) {
        this.statements = statements;
    }
}

class IfStatement extends Statement {
    Expression condition;
    Statement thenBranch;
    Statement elseBranch;

    public IfStatement(Expression condition, Statement thenBranch, Statement elseBranch) {
        this.condition = condition;
        this.thenBranch = thenBranch;
        this.elseBranch = elseBranch;
    }
}

class WhileStatement extends Statement {
    Expression condition;
    Statement body;

    public WhileStatement(Expression condition, Statement body) {
        this.condition = condition;
        this.body = body;
    }
}

// ✅ Expression (นิพจน์)
class NumberLiteral extends Expression {
    long value;

    public NumberLiteral(long value) {
        this.value = value;
    }
}

class Variable extends Expression {
    String name;

    public Variable(String name) {
        this.name = name;
    }
}

class BinaryExpression extends Expression {
    String operator;
    Expression left;
    Expression right;

    public BinaryExpression(String operator, Expression left, Expression right) {
        this.operator = operator;
        this.left = left;
        this.right = right;
    }
}

class InfoExpression extends Expression {
    String infoType;
    String direction;

    public InfoExpression(String infoType, String direction) {
        this.infoType = infoType;
        this.direction = direction;
    }
}