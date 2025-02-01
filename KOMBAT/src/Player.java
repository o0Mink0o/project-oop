import java.util.LinkedList;
import java.util.Queue;
public class Player {
    Queue<Minion> minion = new LinkedList<Minion>();
    protected double budget=10;
    private int spawnleft;
    public Player() {
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
            System.out.println("This is not your spawn board");
            return;
        }
        budget-= spawncost;
        Minion minion1 = new Minion(this);
        Hex.getHex(x,y).setIsminion(minion1);
        minion.add(minion1);
        minion1.setCol(y);
        minion1.setRow(x);
        System.out.println("Spawned minion at board "+x+","+y);


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
