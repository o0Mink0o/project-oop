import java.util.List;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        System.out.println("Which mode do you want to play (PvsP,PvsB,BvsB)");
        Scanner myObj = new Scanner(System.in);
        String input;
        input = myObj.nextLine();
        while (!(input.equals("PvsP")||input.equals("PvsB")||input.equals("BvsB"))) {
            System.out.println("Invalid input");
            System.out.println("Which mode do you want to play (PvsP,PvsB,BvsB)");
            input = myObj.nextLine();
        }
        Player player1;
        Player player2;
        if (input.equals("PvsP")) {
             player1=new Player();
             player2=new Player();
        }else if (input.equals("PvsB")) {
            player1=new Player();
            player2=new Bot();
        }else  {
            player1=new Bot();
            player2=new Bot();
        }
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
        int maxturn=(int)GameConfig.getInstance().get("max_turns");
        Strategy a= ReadStrategy.readfile("KOMBAT/src/Sample_strat.txt");
        Strategy b= ReadStrategy.readfile("KOMBAT/src/testStategy.txt");
        Minion.minionTypeMap.put("",new MinionType("",5,a));
        for(int i=0;i<maxturn/2;i++){
            printBoard(player1);
            System.out.println("Player 1's turn");
            player1.executeTurn();
            printBoard(player1);
            if (checkWin(player1, player2)) break;
            System.out.println("Bot 1's turn");
            player2.executeTurn();
            printBoard(player1);
            if (checkWin(player1, player2)) break;
        }
        System.out.println("== Game Ended ==");
        // หากหลุดจาก loop โดยครบเทิร์น
        evaluateFinalWinner(player1, player2);
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

    private static boolean checkWin(Player player1, Player player2) {
        int count1 = countMinions(player1);
        int count2 = countMinions(player2);

        if (count1 == 0 && count2 == 0) {
            System.out.println("It's a tie! No minions left.");
            return true;
        } else if (count1 == 0) {
            System.out.println("Player 2 wins! Player 1 has no minions left.");
            return true;
        } else if (count2 == 0) {
            System.out.println("Player 1 wins! Player 2 has no minions left.");
            return true;
        }
        return false;
    }

    private static int countMinions(Player p) {
        int count = 0;
        for (int i = 1; i <= 8; i++) {
            for (int j = 1; j <= 8; j++) {
                Minion m = Hex.getHex(i, j).getIsminion();
                if (m != null && m.ownby == p) count++;
            }
        }
        return count;
    }

    private static void evaluateFinalWinner(Player p1, Player p2) {
        int minion1 = countMinions(p1);
        int minion2 = countMinions(p2);

        int hp1 = sumHp(p1);
        int hp2 = sumHp(p2);

        int budget1 = p1.getBudget();
        int budget2 = p2.getBudget();

        if (minion1 > minion2) {
            System.out.println("Player 1 wins by more minions!");
        } else if (minion2 > minion1) {
            System.out.println("Player 2 wins by more minions!");
        } else if (hp1 > hp2) {
            System.out.println("Player 1 wins by more total HP!");
        } else if (hp2 > hp1) {
            System.out.println("Player 2 wins by more total HP!");
        } else if (budget1 > budget2) {
            System.out.println("Player 1 wins by more budget!");
        } else if (budget2 > budget1) {
            System.out.println("Player 2 wins by more budget!");
        } else {
            System.out.println("It's a perfect tie!");
        }
    }

    private static int sumHp(Player p) {
        int sum = 0;
        for (int i = 1; i <= 8; i++) {
            for (int j = 1; j <= 8; j++) {
                Minion m = Hex.getHex(i, j).getIsminion();
                if (m != null && m.ownby == p) sum += m.getHp();
            }
        }
        return sum;
    }

}

