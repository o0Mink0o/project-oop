import java.util.LinkedList;
import java.util.Queue;
public class Player {
    Queue<Minion> minion = new LinkedList<Minion>();
    protected double budget=10;
    private int spawnleft;
    public Player() {
    }

    public int getSpawnleft() {
        return spawnleft;
    }

    public int getBudget() {
        return (int) this.budget;
    }

    protected void Spawnminion(int x,int y){
        int ix=x-1,iy=y-1;
        double spawncost = 5;
        if(budget< spawncost){
            System.out.println("Not enough money");
            return;
        }
        if(Node.board[ix][iy].getIsminion()!=null){
            System.out.println("There is minion on this hex already");
            return;
        }
        if(Node.board[ix][iy].getOwnby()!=this){
            System.out.println("This is not your spawn hex");
            return;
        }
        budget-= spawncost;
        Minion minion1 = new Minion(this);
        Node.board[ix][iy].setIsminion(minion1);
        minion.add(minion1);
        minion1.setCol(y);
        minion1.setRow(x);
        System.out.println("Spawned minion at hex "+x+","+y);


    }

    protected void buyspawmhex(int x,int y){
        int ix=x-1,iy=y-1;
        double hexcost = 5;
        if(budget< hexcost){
            System.out.println("Not enough money");
            return;
        }
        if(Node.board[ix][iy].getOwnby()!=null){
            System.out.println("this hex already has owner");
            return;
        }
        if(Node.board[ix][iy].canbuy(this)){
            budget-= hexcost;
            Node.board[ix][iy].setOwnby(this);
            System.out.println("Buying hex "+x+","+y);
        }else{
            System.out.println("new spawnable hex must adjacent to the your spawnable hexes");
        }




    }

}
