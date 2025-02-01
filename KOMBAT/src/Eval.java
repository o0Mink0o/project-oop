class Eval {
    private final Environment env;

    public Eval(Environment env) {
        this.env = env;
    }

    public void evaluate(Strategy strategy) {
        for (Statement stmt : strategy.statements) {
            execute(stmt);
        }
    }

    private void execute(Statement stmt) {
        if (stmt instanceof AssignmentStatement) {
            executeAssignment((AssignmentStatement) stmt);
        } else if (stmt instanceof MoveCommand) {
            executeMove((MoveCommand) stmt);
        } else if (stmt instanceof AttackCommand) {
            executeAttack((AttackCommand) stmt);
        } else if (stmt instanceof IfStatement) {
            executeIf((IfStatement) stmt);
        } else if (stmt instanceof WhileStatement) {
            executeWhile((WhileStatement) stmt);
        } else if (stmt instanceof BlockStatement) {
            executeBlock((BlockStatement) stmt);
        } else {
            throw new RuntimeException("Unknown statement type: " + stmt.getClass().getSimpleName());
        }
    }

    private void executeAssignment(AssignmentStatement stmt) {
        long value = evaluateExpression(stmt.expression);
        env.assign(stmt.identifier, value);
    }

    private void executeMove(MoveCommand stmt) {
        System.out.println("Moving " + stmt.direction);
    }

    private void executeAttack(AttackCommand stmt) {
        long power = evaluateExpression(stmt.power);
        System.out.println("Shooting " + stmt.direction + " with power " + power);
    }

    private void executeIf(IfStatement stmt) {
        if (evaluateExpression(stmt.condition) != 0) {
            execute(stmt.thenBranch);
        } else {
            execute(stmt.elseBranch);
        }
    }

    private void executeWhile(WhileStatement stmt) {
        while (evaluateExpression(stmt.condition) != 0) {
            execute(stmt.body);
        }
    }

    private void executeBlock(BlockStatement stmt) {
        for (Statement s : stmt.statements) {
            execute(s);
        }
    }

    private long evaluateExpression(Expression expr) {
        if (expr instanceof NumberLiteral) {
            return ((NumberLiteral) expr).value;
        } else if (expr instanceof Variable) {
            return env.get(((Variable) expr).name);
        } else if (expr instanceof BinaryExpression) {
            return evaluateBinary((BinaryExpression) expr);
        } else if (expr instanceof InfoExpression) {
            return evaluateInfo((InfoExpression) expr);
        } else {
            throw new RuntimeException("Unknown expression type: " + expr.getClass().getSimpleName());
        }
    }

    private long evaluateBinary(BinaryExpression expr) {
        long left = evaluateExpression(expr.left);
        long right = evaluateExpression(expr.right);

        switch (expr.operator) {
            case "+" -> {
                return left + right;
            }
            case "-" -> {
                return left - right;
            }
            case "*" -> {
                return left * right;
            }
            case "/" -> {
                if (right == 0) {
                    throw new ArithmeticException("Division by zero");
                }
                return left / right;
            }
            case "%" -> {
                if (right == 0) {
                    throw new ArithmeticException("Division by zero");
                }
                return left % right;
            }
            case ">" -> {
                return left>right? 1:0;
            }
            case "<" -> {
                return left<right? 1:0;
            }
        }
        throw new RuntimeException("Unknown operator: " + expr.operator);
    }

    private long evaluateInfo(InfoExpression expr) {
        return switch (expr.infoType) {
            case "ally" -> 1;
            case "opponent" -> 0;
            case "nearby" -> switch (expr.direction) {
                case "up" -> 1;
                case "down" -> 0;
                default -> 0;
            };
            default -> throw new RuntimeException("Unknown info type: " + expr.infoType);
        };
    }
}