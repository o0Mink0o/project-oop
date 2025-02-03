import java.util.LinkedList;
import java.util.Queue;
import java.util.Scanner;

public class Player {
    Queue<Minion> minion = new LinkedList<Minion>();
    protected double budget;
    private int spawnleft;
    private int turn=0;
    private double intRate;

    public Player() {
        this.budget=(double) GameConfig.getInstance().get("init_budget");
        this.spawnleft=(int)GameConfig.getInstance().get("max_spawns");
    }



    protected int getSpawnLeft() {
        return spawnleft;
    }

    protected int getIntRate() {
        return (int)intRate;
    }

    protected void executeTurn(Strategy s) {
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
                    } else {
                        break; // Valid input, exit the loop
                    }
                } catch (NumberFormatException e) {
                    System.out.println("Invalid input, please enter numbers only. Try again.");
                }
            }

            buyspawmhex(x, y);
            System.out.println("Do you want to buy more spawn hex? (Y/N)");
            input = myObj.nextLine();

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
            System.out.println("Enter row,col where u want to spawn (11->(1,1))");
            pos = myObj.nextInt();
            myObj.nextLine();

                int x, y;
                x = pos / 10;
                y = pos % 10;
                if (x < 1 || x > 8 || y < 1 || y > 8) {
                    System.out.println("Invalid row or col");
                    continue;
                }

                Spawnminion(x, y);
                System.out.println("Do you want to spawn more minion? (Y/N)");
                input = myObj.nextLine();
            }


        for (Minion m : minion) {
            if(m.getHp()<=0) {
                minion.remove(m);
                continue;
            }
            Eval evaluator = new Eval(new Environment());
            evaluator.evaluate(s,m,this);
        }
    }

    protected int getSpawnleft() {
        return spawnleft;
    }

    protected int getBudget() {
        return (int) this.budget;
    }

    protected void Spawnminion(int x,int y){
        double spawncost = (double) GameConfig.getInstance().get("spawn_cost");
        if(budget< spawncost){
            System.out.println("Not enough money");
            return;
        }
        if(Hex.getHex(x,y).getIsminion()!=null){
            System.out.println("There is minion on this board already");
            return;
        }
        if(Hex.getHex(x,y).getOwnby()!=this){
            System.out.println("This is not your spawn hex");
            return;
        }
        budget-= spawncost;
        Minion minion1 = new Minion(this);
        Hex.getHex(x,y).setIsminion(minion1);
        minion.add(minion1);
        minion1.setCol(y);
        minion1.setRow(x);
        System.out.println("Spawned minion at board "+x+","+y);
        spawnleft--;


    }

    protected void buyspawmhex(int x,int y){
        double hexcost = (double) GameConfig.getInstance().get("hex_purchase_cost");
        if(budget< hexcost){
            System.out.println("Not enough money");
            return;
        }
        if(Hex.getHex(x,y).getOwnby()!=null){
            System.out.println("this board already has owner");
            return;
        }
        if(Hex.getHex(x,y).canbuy(this)){
            budget-= hexcost;
            Hex.getHex(x,y).setOwnby(this);
            System.out.println("Buying board "+x+","+y);
        }else{
            System.out.println("new spawnable board must adjacent to the your spawnable hexes");
        }




    }

}
