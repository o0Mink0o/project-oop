import java.util.LinkedList;
import java.util.Queue;
import java.util.Scanner;

public class Player {
    Queue<Minion> minion = new LinkedList<Minion>();
    protected double budget;
    protected int spawnleft;
    protected int turn=0;
    protected double intRate;
    protected Environment globalEnv = new Environment();

    public Player() {
        this.budget=(double) GameConfig.getInstance().get("init_budget");
        this.spawnleft=(int)GameConfig.getInstance().get("max_spawns");
    }

    public Environment getGlobalEnv() {
        return globalEnv;
    }


    protected int getSpawnLeft() {
        return spawnleft;
    }

    protected int getIntRate() {
        return (int)intRate;
    }

    protected void executeTurn() {
        turn++;
        this.budget += (double)GameConfig.getInstance().get("turn_budget");
        intRate=(double)GameConfig.getInstance().get("interest_pct")*Math.log10(budget)*Math.log(turn);
        this.budget+=budget*intRate/100;
        double maxbudget = (double)GameConfig.getInstance().get("max_budget");
        if(this.budget>maxbudget) {
            this.budget=maxbudget;
        }
        Scanner myObj = new Scanner(System.in);
        String input;
        int pos;
        System.out.println("Do you want to buy spawn hex? (Y/N) (yourbudget = "+(int)this.budget+" )");
        input = myObj.nextLine();

        while(!input.equalsIgnoreCase("N")){
            if(!input.equalsIgnoreCase("Y")){
                System.out.println("Invalid input please try again");
                System.out.println("Do you want to buy spawn hex? (Y/N) (yourbudget = "+(int)this.budget+" )");
                input = myObj.nextLine();
                continue;
            }

            System.out.println("Enter row,col where you want to buy (11->(1,1))");
            int x, y;
            while (true) {
                try {
                    pos = Integer.parseInt(myObj.nextLine().trim()); // Using parseInt to handle exceptions
                    x = pos / 10;
                    y = pos % 10;

                    if (x < 1 || x > 8 || y < 1 || y > 8) {
                        System.out.println("Invalid row or col. Try again.");
                        System.out.println("Enter row,col where you want to buy (11->(1,1))");
                    } else {
                        break; // Valid input, exit the loop
                    }
                } catch (NumberFormatException e) {
                    System.out.println("Invalid input, please enter numbers only. Try again.");
                    System.out.println("Enter row,col where you want to buy (11->(1,1))");
                }
            }

            if(buyspawmhex(x, y)){
                break;
            }

        }


        System.out.println("Do you want to spawn minion? (Y/N) (yourbudget = "+(int)this.budget+" )");
        input = myObj.nextLine();
        while(!input.equalsIgnoreCase("N")) {
            if (!input.equalsIgnoreCase("Y")) {
                System.out.println("Invalid input please try again");
                System.out.println("Do you want to spawn minion? (Y/N) (yourbudget = "+(int)this.budget+" )");
                input = myObj.nextLine();
                continue;
            }
            if (spawnleft == 0) {
                System.out.println("You have 0 spawnleft");
                break;
            }
            int x, y;
            System.out.println("Enter row,col where you want to buy (11->(1,1))");
            while (true) {
                try {
                    pos = Integer.parseInt(myObj.nextLine().trim()); // Using parseInt to handle exceptions
                    x = pos / 10;
                    y = pos % 10;

                    if (x < 1 || x > 8 || y < 1 || y > 8) {
                        System.out.println("Invalid row or col. Try again.");
                        System.out.println("Enter row,col where you want to buy (11->(1,1))");
                    } else {
                        break; // Valid input, exit the loop
                    }
                } catch (NumberFormatException e) {
                    System.out.println("Invalid input, please enter numbers only. Try again.");
                    System.out.println("Enter row,col where you want to buy (11->(1,1))");
                }
            }

                if(Spawnminion(x, y)){
                    break;
                }
        }


        for (Minion m : minion) {
            if(m.getHp()<=0) {
                minion.remove(m);
                continue;
            }
            Eval evaluator = new Eval(m.getEnv(), this.getGlobalEnv());
            evaluator.evaluate(m,this);
        }
    }

    protected int getSpawnleft() {
        return spawnleft;
    }

    protected int getBudget() {
        return (int) this.budget;
    }

    protected boolean Spawnminion(int x, int y) {
        double spawncost = (double) GameConfig.getInstance().get("spawn_cost");

        // Test: เงินไม่พอ
        if (budget < spawncost) {
            System.out.println("Not enough money");
            return false;
        }

        // Test: พื้นที่มีมินเนี่ยนอยู่แล้ว
        if (Hex.getHex(x, y).getIsminion() != null) {
            System.out.println("There is already a minion on this board");
            return false;
        }

        // Test: พื้นที่ไม่ใช่พื้นที่ของผู้เล่น
        if (Hex.getHex(x, y).getOwnby() != this) {
            System.out.println("This is not your spawn hex");
            return false;
        }

        // Test: การสร้างมินเนี่ยนสำเร็จ
        budget -= spawncost;
        Minion minion1 = new Minion(this,"");
        Hex.getHex(x, y).setIsminion(minion1);
        minion.add(minion1);
        minion1.setCol(y);
        minion1.setRow(x);
        System.out.println("Spawned minion at board " + x + "," + y);
        spawnleft--;
        return true;
    }


    protected boolean buyspawmhex(int x, int y) {
        double hexcost = (double) GameConfig.getInstance().get("hex_purchase_cost");

        // Test: ไม่มีงบประมาณพอ
        if (budget < hexcost) {
            System.out.println("Not enough money");
            return false;
        }

        // Test: Hex มีเจ้าของอยู่แล้ว
        if (Hex.getHex(x, y).getOwnby() != null) {
            System.out.println("This board already has an owner");
            return false;
        }

        // Test: การซื้อสำเร็จ
        if (Hex.getHex(x, y).canbuy(this)) {
            budget -= hexcost;
            Hex.getHex(x, y).setOwnby(this);
            System.out.println("Buying board " + x + "," + y);
            return true;
        } else {
            // Test: Hex ที่ซื้อไม่ได้เชื่อมต่อกับพื้นที่เดิม
            System.out.println("New spawnable board must be adjacent to your spawnable hexes");
        }
        return false;
    }



}
