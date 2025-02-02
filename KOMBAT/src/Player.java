import java.util.LinkedList;
import java.util.Queue;
import java.util.Scanner;

public class Player {
    Queue<Minion> minion = new LinkedList<Minion>();
    protected double budget=20;
    private int spawnleft=10;
    public Player() {
    }


    protected int getSpawnLeft() {
        return spawnleft;
    }

    protected void executeTurn(Strategy s) {
        Scanner myObj = new Scanner(System.in);
        String input;
        int pos;
        System.out.println("Do you want to buy spawn hex? (Y/N)");
        input = myObj.nextLine();
        while(!input.equalsIgnoreCase("N")){
            if(!input.equalsIgnoreCase("Y")){
                System.out.println("Invalid input please try again");
                System.out.println("Do you want to spawn minion? (Y/N)");
                input = myObj.nextLine();
                continue;
            }
            System.out.println("Enter row,col where u want to buy (11->(1,1))");
            pos = myObj.nextInt();
            myObj.nextLine();
            int x,y;
            x=pos/10;
            y=pos%10;
            if(x<1||x>8||y<1||y>8){
                System.out.println("Invalid row or col");
                continue;
            }
            buyspawmhex(x, y);
            System.out.println("Do you want to buy more spawn hex? (Y/N)");
            input = myObj.nextLine();
        }
        System.out.println("Do you want to spawn minion? (Y/N)");
        input = myObj.nextLine();
        while(!input.equalsIgnoreCase("N")){
            if(!input.equalsIgnoreCase("Y")){
                System.out.println("Invalid input please try again");
                System.out.println("Do you want to spawn minion? (Y/N)");
                input = myObj.nextLine();
                continue;
            }
            if(spawnleft==0){
                System.out.println("You have 0 spawnleft");
                break;
            }
            System.out.println("Enter row,col where u want to spawn (11->(1,1))");
            pos = myObj.nextInt();
            myObj.nextLine();
            int x,y;
            x=pos/10;
            y=pos%10;
            if(x<1||x>8||y<1||y>8){
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
        double spawncost = 5;
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
        double hexcost = 5;
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
