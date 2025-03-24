package gamestate;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;
import java.util.Scanner;

public class Bot extends Player{

    public Bot(){
        super();
    }
    //fixed execute
    @Override
    protected void executeTurn() {
        turn++;
        this.budget += (double)GameConfig.getInstance().get("turn_budget");
        intRate=(double)GameConfig.getInstance().get("interest_pct")*Math.log10(budget)*Math.log(turn);
        this.budget+=budget*intRate/100;
        double maxbudget = (double)GameConfig.getInstance().get("max_budget");
        if(this.budget>maxbudget) {
            this.budget=maxbudget;
        }

        if(budget > 9000){
            while(true){
                buyhexLoop:
                for(int i=8;i>0;i--){
                    for(int j=8;j>0;j--){
                        if(Hex.getHex(i,j).canbuy(this)){
                            buyspawmhex(i,j);
                            break buyhexLoop;
                        }
                    }
                }
                break;
            }
        }
        if(budget > 7000){
            while(true) {
                if (spawnleft == 0) {
                    System.out.println("You have 0 spawnleft");
                    break;
                }
                SpawnminionLoop:
                for(int i=8;i>0;i--){
                    for(int j=8;j>0;j--){
                        List<String> types = new ArrayList<>(Minion.minionTypeMap.keySet());
                        String randomType = types.get(new Random().nextInt(types.size()));
                        if(Spawnminion(i, j,randomType)){
                            break SpawnminionLoop;
                        }
                    }
                }
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
}
