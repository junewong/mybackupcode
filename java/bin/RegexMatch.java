import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class RegexMatch {

	public static String getFistGroup( String regex, String str ) {
		try {
			Pattern p = Pattern.compile( regex );
			Matcher matcher = p.matcher( str );

			if ( matcher.find() ) {
				return matcher.groupCount() == 0 ? str : matcher.group( 1 );

			} else {
				return null;
			}
			
		} catch ( Exception e ) {
			e.printStackTrace();
		}

		return null;
		
	} 

	public static void main(String[] args) {
		String regex = args[0];
		String str = args[1];
		String result = getFistGroup( regex, str );
		System.out.println( result );
	}
}
