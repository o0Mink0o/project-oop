package gamestate;

class Eval {
    private final Environment localEnv;
    private final Environment globalEnv;
    private Minion m;
    private Player p;

    public Eval(Environment localEnv, Environment globalEnv) {
        this.localEnv = localEnv;
        this.globalEnv = globalEnv;
    }

    public void evaluate(Minion newMinion,Player player) {
        this.m=newMinion;
        this.p=player;
        Strategy thisMStrat =newMinion.getStrategy();
        if(thisMStrat==null){return;}
        for (Statement stmt : thisMStrat.statements) {
            if(execute(stmt)==0){
                System.out.println("this minion executed");
                break;
            }
        }
    }

    private int execute(Statement stmt) {
        if (stmt instanceof AssignmentStatement) {
            executeAssignment((AssignmentStatement) stmt);
        } else if (stmt instanceof DoneStatement) {
            return 0;  // หยุด eval ทันทีเมื่อพบ DoneStatement
        } else if (stmt instanceof MoveCommand) {
            if (executeMove((MoveCommand) stmt) == 0) { // หยุดถ้าการ move สำเร็จ
                return 0;
            }
        } else if (stmt instanceof AttackCommand) {
            if (executeAttack((AttackCommand) stmt) == 0) { // หยุดถ้าการโจมตีสำเร็จ
                return 0;
            }
        } else if (stmt instanceof IfStatement) {
            if (executeIf((IfStatement) stmt) == 0) { // หยุดถ้ามี move, attack หรือ done ภายใน If
                return 0;
            }
        } else if (stmt instanceof WhileStatement) {
            if (executeWhile((WhileStatement) stmt) == 0) { // หยุดถ้ามี move, attack หรือ done ภายใน While
                return 0;
            }
        } else if (stmt instanceof BlockStatement) {
            if (executeBlock((BlockStatement) stmt) == 0) { // หยุดถ้ามี move, attack หรือ done ภายใน Block
                return 0;
            }
        } else {
            throw new RuntimeException("Unknown statement type: " + stmt.getClass().getSimpleName());
        }
        return 1; // ดำเนินการต่อถ้ายังไม่มีคำสั่งที่ต้องหยุด
    }

    private void executeAssignment(AssignmentStatement stmt) {
        long value = evaluateExpression(stmt.expression);
        if (Environment.isGlobal(stmt.identifier)) {
            globalEnv.forceAssign(stmt.identifier, value);
        } else {
            localEnv.assign(stmt.identifier, value);
        }
    }

    private int executeMove(MoveCommand stmt) {
        boolean status = this.m.move(getIntDirec(stmt.direction));
        if (status) {
            System.out.println("Moving " + stmt.direction);
        }
        return 0;
    }

    private int executeAttack(AttackCommand stmt) {
        long power = evaluateExpression(stmt.power);
        System.out.println("Shooting " + stmt.direction + " with power " + power);
        this.m.shoot(getIntDirec(stmt.direction), power);
        return 0; // หยุด eval หลังจากยิง
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

    private int executeIf(IfStatement stmt) {
        if (evaluateExpression(stmt.condition) > 0) {
            return execute(stmt.thenBranch); // ถ้าภายในมี move/attack/done ให้หยุด
        } else {
            return execute(stmt.elseBranch);
        }
    }

    private int executeWhile(WhileStatement stmt) {
        for (int i = 0; evaluateExpression(stmt.condition) != 0 && i < 10000; i++) {
            if (execute(stmt.body) == 0) { // หยุดทันทีถ้าภายในมี move/attack/done
                return 0;
            }
        }
        return 1;
    }

    private int executeBlock(BlockStatement stmt) {
        for (Statement s : stmt.statements) {
            if (execute(s) == 0) { // ถ้าเจอคำสั่งที่ต้องหยุด ให้หยุดทันที
                return 0;
            }
        }
        return 1;
    }

    private long evaluateExpression(Expression expr) {
        if (expr instanceof NumberLiteral) {
            return ((NumberLiteral) expr).value;
        } else if (expr instanceof Variable) {
            String name = ((Variable) expr).name;
            if (Environment.isGlobal(name)) {
                long val = globalEnv.get(name);
                System.out.println("[GLOBAL] Read " + name + " = " + val);
                return val;
            } else {
                long val = localEnv.get(name);
                System.out.println("[LOCAL] Read " + name + " = " + val);
                return val;
            }
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
            case "int" -> p.getIntRate();
            case "maxbudget" -> GameConfig.getInstance().get("max_budget");
            case "spawnsleft" -> p.getSpawnleft();
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