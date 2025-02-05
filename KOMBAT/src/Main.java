import java.util.List;

public class Main {
    public static void main(String[] args) {
        Player player1=new Player();
        Bot bot1=new Bot();
        for(int i=0;i<8;i++){
            for(int j=0;j<8;j++){
                if ((i <= 1 && j <= 1) || (i == 0 && j == 2)) {
                    Hex.board[i][j] = new Hex(player1);
                    continue;
                }
                if((i >= 6 && j >= 6) || (i == 7 && j == 5)){
                    Hex.board[i][j] = new Hex(bot1);
                    continue;
                }
                Hex.board[i][j]=new Hex();
            }
        }
        int maxturn=(int)GameConfig.getInstance().get("max_turns");
        for(int i=0;i<maxturn/2;i++){
            printBoard(player1);
            Strategy a= ReadStrategy.readfile("KOMBAT/src/testStategy.txt");
            System.out.println("Player 1's turn");
            player1.executeTurn(a);
            printBoard(player1);
            Strategy b= ReadStrategy.readfile("KOMBAT/src/testStategy.txt");
            System.out.println("Bot 1's turn");
            bot1.executeTurn(b);
            printBoard(player1);
        }
    }



    private static void printBoard(Player player1) {
        for (int i = 0; i < 36; i++) {
            System.out.print("-");
        }
        System.out.println();
        for(int i=1;i<=8;i++){
            for(int j=1;j<=8;j++){

                if(j%2==1){
                    System.out.print("     ");
                    continue;
                }
                checkMinion(player1, i, j);
            }
            System.out.println();
            for(int j=1;j<=8;j++){

                if(j%2==0){
                    System.out.print("     ");
                    continue;
                }
                checkMinion(player1, i, j);
            }
            System.out.println();
        }
        for (int i = 0; i < 36; i++) {
            System.out.print("-");
        }
        System.out.println();
    }

    private static void checkMinion(Player player1, int i, int j) {
        if(Hex.getHex(i,j).getIsminion()!=null){
            if(Hex.getHex(i,j).getIsminion().ownby== player1){
                System.out.print(1+"    ");
            }else{
                System.out.print(2+"    ");
            }
        }else{
            System.out.print(0+"    ");
        }
    }
}

