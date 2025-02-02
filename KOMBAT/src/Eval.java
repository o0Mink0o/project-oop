class Eval {
    private final Environment env;
    private Minion m;
    private Player p;

    public Eval(Environment env) {
        this.env = env;
    }

    public void evaluate(Strategy strategy, Minion newMinion,Player player) {
        this.m=newMinion;
        this.p=player;
        if(strategy==null){return;}
        for (Statement stmt : strategy.statements) {
            if(execute(stmt)==0){
                break;
            }
        }
    }

    private int execute(Statement stmt) {
        if (stmt instanceof DoneStatement) {return 0;}
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
        return 1;
    }

    private void executeAssignment(AssignmentStatement stmt) {
        long value = evaluateExpression(stmt.expression);
        env.assign(stmt.identifier, value);
    }

    private void executeMove(MoveCommand stmt) {
        int status=this.m.move(getIntDirec(stmt.direction));
        if(status==0){
            execute(new DoneStatement());
            return;
        }if(status==1){
            System.out.println("Moving " + stmt.direction);
        }
    }

    private void executeAttack(AttackCommand stmt) {
        long power = evaluateExpression(stmt.power);
        System.out.println("Shooting " + stmt.direction + " with power " + power);
        this.m.shoot(getIntDirec(stmt.direction),power);
    }

    private int getIntDirec(String direction) {
         switch (direction) {
             case "up" -> {
                 return 1;
             }
             case "upright" -> {
                 return 2;
             }
             case "downright" -> {
                 return 3;
             }
             case "down" -> {
                 return 4;
             }
             case "downleft" -> {
                 return 5;
             }
             case "upleft" -> {
                 return 6;
             }
             default -> throw new RuntimeException("Unknown direction: " + direction);
        }
    }

    private void executeIf(IfStatement stmt) {
        if (evaluateExpression(stmt.condition) != 0) {
            execute(stmt.thenBranch);
        } else {
            execute(stmt.elseBranch);
        }
    }

    private void executeWhile(WhileStatement stmt) {
        for (int i=0;evaluateExpression(stmt.condition) != 0&&i<10000;i++) {
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
        } else if (expr instanceof gameStatus) {
            return evaluateGameStatus((gameStatus) expr);
        } else if (expr instanceof BinaryExpression) {
            return evaluateBinary((BinaryExpression) expr);
        } else if (expr instanceof InfoExpression) {
            return evaluateInfo((InfoExpression) expr);
        } else {
            throw new RuntimeException("Unknown expression type: " + expr.getClass().getSimpleName());
        }
    }

    private long evaluateGameStatus(gameStatus expr) {
        return switch (expr.name) {
            case "ally" -> m.calAlly(p);
            case "nearby" -> calNearby(expr.direction);
            case "opponent" -> m.calOpponent(p);
            case "row" -> m.getRealRow();
            case "col" -> m.getRealCol();
            case "budget" -> p.getBudget();
            case "int" -> 6;
            case "maxbudget" -> 7;
            case "spawnsleft" -> 8;
            case "random" -> (int)(Math.random() * 1000);
            default -> throw new RuntimeException("Unknown gameStatus: " + expr.name);
        };
    }

    private Long calNearby(String direc) {
        int direction = getIntDirec(direc);
        return (long) m.getNearby(direction);
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
            case "^" -> {
                return (int) Math.pow(left,right);
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