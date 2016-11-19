import org.jsoup.Jsoup;
import org.jsoup.nodes.Document;
import org.jsoup.nodes.Element;
import org.jsoup.select.Elements;

/**
 * 小工具，命令行下用jsoup筛选信息
 *
 * e.g.:
 * 	./crawler "http://ios.d.cn/apps/iphone-games.html"   ".panel-list a" "href"
 *
 * @author junewong<wangzhu@ucweb.com>
 * @date 2016-03-10
 */
public class Crawler {

	final private static String PC_USER_AGENT = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/51.0.2704.103 Safari/537.36";

	public static void main(String[] args) {
		if ( args.length < 1 ) {
			System.err.println( "No argument input！" );
			System.exit( 1 );
		}

		String url = args[0];
		String regex = null;
		String attr = null;

		if ( args.length >= 2 ) {
			regex = args[1];
		}

		if ( args.length >= 3 ) {
			attr = args[2];
		}

		/*
	   // 打印参数
		for ( String value : args ) {
			System.out.println( value );
		}
		*/

		Document doc  = null;
		String html = "";

		try {
			doc = Jsoup.connect( url ).timeout( 5000 ).userAgent(PC_USER_AGENT ).get();
			if ( null == regex || "".equals( regex ) ) {
				html = doc.outerHtml();
			} else {
				Elements elements = doc.select( regex );

				if ( null == attr || "".equals( attr ) ) {
					html = elements.outerHtml();

				} else {
					StringBuffer sb = new StringBuffer();
					int i = 0;
					for ( Element element : elements ) {
						if ( i > 0 ) {
							sb.append( "\n" );
						}

						String text = "";
						if ( attr.indexOf( "+" ) >= 0 ) {
							text = getMultiAttrValue( element, attr, "\\+" );

						} else if ( attr.indexOf( "|" ) >= 0 ) {
							text = getFirstAttrValue( element, attr, "\\|" );

						} else if ( attr.indexOf( "," ) >= 0 ) {
							text = getFirstAttrValue( element, attr, "," );

						} else {
							text = getAttrValue( element, attr );
						}

						sb.append( text );
						i ++;
					}
					html = sb.toString();
				}
			}
			System.out.println( html );
		}
		catch (Exception e) {
			System.err.println( "ERROR, url:" + url );
			e.printStackTrace();
		}
	}

	private static String getFirstAttrValue( Element element, String attr, String splitWord  ) {
		String [] attrList = attr.split( splitWord );
		String text = "";
		for ( String attrItem : attrList ) {
			attrItem = attrItem.trim();
			text = attrItem.equals( "text()" ) ? element.text() : element.attr( attrItem );
			if ( text != null && ! "".equals( text ) ) {
				break;
			}
		}
		return text;
	} 

	private static String getMultiAttrValue( Element element, String attr, String splitWord ) {
		String [] attrList = attr.split( splitWord );
		String text = "";
		for ( String attrItem : attrList ) {
			attrItem = attrItem.trim();
			String value = attrItem.equals( "text()" ) ? element.text() : element.attr( attrItem );
			if ( value != null && ! "".equals( value ) ) {
				if( ! "".equals( text ) ) {
					text += "\t";
				}
				text += value;
			}
		}
		return text;
	} 

	private static String getAttrValue( Element element, String attr ) {
		String value = attr.equals( "text()" ) ? element.text() : element.attr( attr );
		return value;
	}
	
}
