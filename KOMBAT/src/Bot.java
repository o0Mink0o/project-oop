
import java.util.Random;
import java.util.Scanner;

public class Bot extends Player{

    public Bot(){
        super();
    }
    //fixed execute
    @Override
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
        if(budget > 9000){
            input = "Y";
        }
        else{
            input = "N";
        }

        boolean flag=false;
        while(!input.equalsIgnoreCase("N") && !flag){
            if(!input.equalsIgnoreCase("Y")){
                System.out.println("Invalid input please try again");
                System.out.println("Do you want to buy spawn hex? (Y/N) (yourbudget = "+(int)this.budget+" )");
                input = myObj.nextLine();
                continue;
            }
            buyhexLoop:
            for(int i=8;i>0;i--){
                for(int j=8;j>0;j--){
                    if(Hex.getHex(i,j).canbuy(this)){
                        buyspawmhex(i,j);
                        flag=true;
                        break buyhexLoop;
                    }
                }
            }
        }


        System.out.println("Do you want to spawn minion? (Y/N) (yourbudget = "+(int)this.budget+" )");
        if(budget > 9000){
            input = "Y";
        }
        else{
            input = "N";
        }

        boolean flag2=false;
        while(!input.equalsIgnoreCase("N") && !flag2) {
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
            SpawnminionLoop:
            for(int i=8;i>0;i--){
                for(int j=8;j>0;j--){
                    if(Spawnminion(i,j) == 1){
                        flag2=true;
                        break SpawnminionLoop;
                    }
                }
            }
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
}
