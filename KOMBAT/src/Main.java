import java.util.List;

public class Main {
    public static void main(String[] args) {
        Player player1=new Player();
        Player player2=new Player();
        for(int i=0;i<8;i++){
            for(int j=0;j<8;j++){
                if ((i <= 1 && j <= 1) || (i == 0 && j == 2)) {
                    Hex.board[i][j] = new Hex(player1);
                    continue;
                }
                if((i >= 6 && j >= 6) || (i == 7 && j == 5)){
                    Hex.board[i][j] = new Hex(player2);
                    continue;
                }
                Hex.board[i][j]=new Hex();
            }
        }
        System.out.println(Hex.getHex(1,1).getOwnby());

        player1.Spawnminion(1,1);
        player1.Spawnminion(1,1);
        player1.Spawnminion(8,3);
        player1.Spawnminion(1,2);
        System.out.println(player1.minion);
        player1.Spawnminion(2,2);

        player2.Spawnminion(8,8);
        player2.buyspawmhex(6,8);
        System.out.println(Hex.getHex(6,8).getOwnby());
        System.out.println(player2);

        Hex.board[0][0].getIsminion().move(4);

        ReadStrategy.readfile("C:\\Users\\nathd\\IdeaProjects\\project-oop\\KOMBAT\\src\\Sample_strat.txt");







    }
}