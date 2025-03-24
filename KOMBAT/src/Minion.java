import java.util.HashMap;
import java.util.Map;

public class Minion {
    private int def;
    private int hp=100;
    private int col,row;
    final Player ownby;
    final Strategy strategy;
    private Environment env = new Environment();
    final static Map<String, MinionType> minionTypeMap = new HashMap<>();

    public Environment getEnv() { return env; }

    protected Minion(Player ownby,String typeName) {
        this.ownby = ownby;
        MinionType thisType = minionTypeMap.get(typeName);
        this.strategy = thisType.strategy;
        this.def = thisType.def;
        this.hp= (int)GameConfig.getInstance().get("init_hp");
    }

    protected Strategy getStrategy(){return strategy;}

    protected int getDef() {
        return def;
    }

    protected int getHp() {
        return hp;
    }

    protected int getRealCol() {
        return col;
    }

    protected int getRealRow() {
        return row;
    }

    protected void setCol(int col) {
        this.col = col;
    }
    protected void setRow(int Row) {
        this.row = Row;
    }
    protected void setHp(int Hp) {
        this.hp = Hp;
    }

    protected boolean move(int direction) {
        if(this.ownby.getBudget()<=0){
            return false;
        }else{
            this.ownby.budget -= 1;
        }
        int newPos = getDirection(direction, row, col);
        int newPosX = newPos/10;
        int newPosY = newPos%10;

        if (newPos == -1) {
            System.out.println("cant move to that direction");
            return false;
        }
        if (Hex.getHex(newPosX,newPosY).getIsminion()!=null) {
            System.out.println("cant move to that direction");
            return false;
        }
        Hex.getHex(row,col).setIsminion(null);
        row = newPosX;
        col = newPosY;
        Hex.getHex(row,col).setIsminion(this);
        return true;
    }

    protected void shoot(int direction,double cost) {
        if(this.ownby.getBudget()<=0){
            System.out.println("not enough budget to shoot");
            return ;
        }
        int target = getDirection(direction, row, col);
        this.ownby.budget-=cost;

        if (target == -1) {
            System.out.println("cant shoot to that direction");
            return;
        }
        int targetRow = target / 10;
        int targetCol = target % 10;
        if(Hex.getHex(targetRow, targetCol).getIsminion()==null){
            return;
        }
        int hp= Hex.getHex(targetRow, targetCol).getIsminion().getHp();
        int def= Hex.getHex(targetRow, targetCol).getIsminion().getDef();
        if(cost-1<=def){
            Hex.getHex(targetRow, targetCol).getIsminion().setHp(hp-1);
        }else{
            Hex.getHex(targetRow, targetCol).getIsminion().setHp(hp-(int) (cost -1-def));
        }
        if(Hex.getHex(targetRow, targetCol).getIsminion().getHp()<=0){
            Hex.getHex(targetRow, targetCol).setIsminion(null);
        }
    }

    private static int getDirection(int direction, int row, int col) {
        int newRow = row, newCol = col;

        switch (direction) {
            case 1:
                newRow--;
                break;
            case 2:
                newCol++;
                if (col % 2 == 0) newRow--;
                break;
            case 3:
                newCol++;
                if (col % 2 != 0) newRow++;
                break;
            case 4:
                newRow++;
                break;
            case 5:
                newCol--;
                if (col % 2 != 0) newRow++;
                break;
            case 6:
                newCol--;
                if (col % 2 == 0) newRow--;
                break;
            default:
                return -1;
        }

        if (newRow < 1 || newRow > 8 || newCol < 1 || newCol > 8) {
            return -1;
        }

        return newRow * 10 + newCol;
    }

    protected int getNearby(int direction) {
        int target = getDirection(direction, row, col);
        int targetRow ;
        int targetCol ;
        for(int i=1;target!=-1;i++){
            targetRow = target / 10;
            targetCol = target % 10;
            if(Hex.getHex(targetRow, targetCol).getIsminion()!=null){
                int hp = Hex.getHex(targetRow, targetCol).getIsminion().getHp();
                int def= Hex.getHex(targetRow, targetCol).getIsminion().getDef();
                if(this.ownby==Hex.getHex(targetRow, targetCol).getIsminion().ownby){
                    return (hp*100+def*10+i)*-1;
                }
                return hp*100+def*10+i;
            }
            target = getDirection(direction, targetRow, targetCol);
        }
        return 0;
    }



    protected int calOpponent(Player player) {
        int opponent=86,currentOpponent;
        for (int direction = 1; direction <= 6; direction++) {
            int target = getDirection(direction, row, col);
            int targetRow ;
            int targetCol ;
            for(int i=1;target!=-1;i++){
                targetRow = target / 10;
                targetCol = target % 10;
                if(Hex.getHex(targetRow, targetCol).getIsminion()!=null){
                    if(Hex.getHex(targetRow, targetCol).getOwnby()==player){
                        target = getDirection(direction, targetRow, targetCol);
                        continue;
                    }else{
                        currentOpponent=i*10+direction;
                        if(opponent>currentOpponent){
                            opponent=currentOpponent;
                        }
                    }
                }
                target = getDirection(direction, targetRow, targetCol);
            }
        }
        return opponent==86? 0:opponent;
    }


    protected int calAlly(Player player) {
        int ally =86, currentAlly;
        for (int direction = 1; direction <= 6; direction++) {
            int target = getDirection(direction, row, col);
            int targetRow ;
            int targetCol ;
            for(int i=1;target!=-1;i++){
                targetRow = target / 10;
                targetCol = target % 10;
                if(Hex.getHex(targetRow, targetCol).getIsminion()!=null){
                    if(Hex.getHex(targetRow, targetCol).getOwnby()!=player){
                        target = getDirection(direction, targetRow, targetCol);
                        continue;
                    }else{
                        currentAlly =i*10+direction;
                        if(ally > currentAlly){
                            ally = currentAlly;
                        }
                    }
                }
                target = getDirection(direction, targetRow, targetCol);
            }
        }
        return ally ==86? 0: ally;
    }


}
