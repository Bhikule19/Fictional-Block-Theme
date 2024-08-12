<?php 

// require get_theme_file_path('./inc/search-route.php');
// require get_theme_file_path('./inc/like-route.php');

//Adding style sheet

add_action('wp_enqueue_scripts', 'custom_style_sheet');

function custom_style_sheet(){
    wp_enqueue_script('main-js-file', get_theme_file_uri('./build/index.js'), array('jquery'), '1.0.0', true);
    wp_enqueue_style('google-font', '//fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i|Roboto:100,300,400,400i,700,700i');
    wp_enqueue_style('font-awesome', '//cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css');
    wp_enqueue_style('custom_main_styles', get_theme_file_uri('./build/style-index.css'));
    wp_enqueue_style('custom_reset_styles', get_theme_file_uri('./build/index.css'));

    wp_localize_script('main-js-file', 'universityData', array(
        'root_url' => get_site_url(),
        'nonce' => wp_create_nonce('wp_rest'),
    ));
}
//Adding  new property to the raw JSON data ( new custom field to the WordPress REST API for posts.)
//In this case, the function university_custom_rest_api_data is registered to run when the REST API is initialized using the rest_api_init action hook. Within this function, the register_rest_field function is used to add a new field called authorName to the REST API response for posts. The get_callback parameter is set to a anonymous function that returns the author of the current post using the get_the_author function.
function university_custom_rest_api_data(){
    register_rest_field('post', 'authorName', array(
        'get_callback' => function(){
            return get_the_author();
        }
    ));
}

add_action('rest_api_init', 'university_custom_rest_api_data');

// function to display the page bg and subtite dynamically
function display_page_banner_subtitle($args = null){ //In your case, you want to check if the $args variable is null 
    
    if(!isset($args['title'])) {
        $args['title'] = get_the_title();
      }
    if(!isset($args['subtitle'])){
        $args['subtitle'] = get_field('page_banner_subtitle');
    }
    if(!isset($args['photo'])){
        //function works well in many situations, however, when used on an archive page (for example the All Events page/query) if the first event in the list of events has a background image our code can get confused and try to use it as the banner for the entire Archive page.
        if(get_field('page_banner_background_image') && !is_archive() && !is_home()){
            $args['photo'] = get_field('page_banner_background_image')['sizes']['pageBanner'];
        } else {
            $args['photo'] = get_theme_file_uri('./images/ocean.jpg');
        }
    }

    ?>

<div class="page-banner">
      <div class="page-banner__bg-image" style="background-image: url(<?php echo $args['photo']; 
      ?>);"></div>
      <div class="page-banner__content container container--narrow">
        <h1 class="page-banner__title"><?php echo $args['title'] ?></h1>
        <div class="page-banner__intro">
          <p><?php echo $args['subtitle']; ?></p>
        </div>
      </div>  
    </div>

<?php }


function custom_theme_features(){
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_image_size('professorLandscape', 400, 260, true);
    add_image_size('professorPortrait', 480, 650, true);
    add_image_size('quicktest', 100, 100, true);
    add_image_size('pageBanner', 1500, 350, true);
    add_theme_support('editor-styles');
  add_editor_style(array('https://fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i|Roboto:100,300,400,400i,700,700i', 'build/style-index.css', 'build/index.css'));
    // register_nav_menu('HeaderMenuLocation', 'Header Menu Location'); //Registers a navigation menu location for a theme.
    // register_nav_menu('footerlocationone', 'Footer Location One'); //Registers a navigation menu location for a theme.
    // register_nav_menu('footerlocationytwo', 'Footer Location Two'); //Registers a navigation menu location for a theme.

}
add_action('after_setup_theme', 'custom_theme_features');



function custom_adjust_queries($query){

    if(!is_admin() && is_post_type_archive('program') && is_main_query() ){
        $query->set('orderby', 'title');
        $query->set('order', 'ASC');
        $query->set('posts_per_page', -1);
    }

    if(!is_admin() && is_post_type_archive('event') && is_main_query()){
        $query->set('meta_key', 'event_date');
        $query->set('orderby', 'meta_value_num');
        $query->set('order', 'ASC');
        $query->set('meta_query', array(
            array(
                'key' => 'event_date',
                'compare' => '>=',
                'value' => date('Y-m-d'),
                'type' => 'DATE'
                )
            ));
    
    }

}

add_action('pre_get_posts', 'custom_adjust_queries');

//Redirect subscriber account out of admin and onto homepage

add_action('admin_init', 'redirectSubsToFrontend');

function redirectSubsToFrontend() {
    $curentUser = wp_get_current_user();

    if(count($curentUser->roles) === 1 && $curentUser-> roles[0] === 'subscriber' ){
        wp_safe_redirect( home_url('/') );
        exit;
    }
}

// to not let them have sho w thw admin bar
add_action('wp_loaded', 'noSubsAdminBar');
function noSubsAdminBar() {
    $curentUser = wp_get_current_user();

    if(count($curentUser->roles) === 1 && $curentUser-> roles[0] === 'subscriber' ){
        show_admin_bar(false);
    }
}

//customise login screen

add_filter('login_headerurl', 'headerURL');
function headerURL(){
    return esc_url(site_url('./'));
}

// add css to the login screen

add_action('login_enqueue_scripts', 'ourLoginCSS');

function ourLoginCSS(){
    wp_enqueue_style('google-font', '//fonts.googleapis.com/css?family=Roboto+Condensed:300,300i,400,400i,700,700i|Roboto:100,300,400,400i,700,700i');
    wp_enqueue_style('font-awesome', '//cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css');
    wp_enqueue_style('custom_main_styles', get_theme_file_uri('./build/style-index.css'));
    wp_enqueue_style('custom_reset_styles', get_theme_file_uri('./build/index.css'));

    wp_localize_script('main-js-file', 'universityData', array(
        'root_url' => get_site_url(),
    ));
}

// change the h1 tag name of the login header 

add_filter('login_headertitle', 'ourLoginTitle');

function ourLoginTitle(){
    return 'University Login';
}

class PlaceholderBlock {
    public $name;
    function __construct($name) {
      $this->name = $name;
      add_action('init', [$this, 'onInit']);
    }
  
    function onInit() {
      wp_register_script($this->name, get_stylesheet_directory_uri() . "/our-blocks/{$this->name}.js", array('wp-blocks', 'wp-editor'));
      
      register_block_type("ourblocktheme/{$this->name}", array(
        'editor_script' => $this->name,
        'render_callback' => [$this, 'ourRenderCallback']
      ));
    }

    function ourRenderCallback($attributes, $content) {
        ob_start();
        require get_theme_file_path("/our-blocks/{$this->name}.php");
        return ob_get_clean();
      }

  }
  
  new PlaceholderBlock("eventsandblogs");
  new PlaceholderBlock("header");
  new PlaceholderBlock("footer");

  class JSXBlock{
    public $name;
    public $renderCallback;
    public $data;
    function __construct($name, $renderCallback = null, $data = null)
    {
        $this->name = $name;
        $this->renderCallback = $renderCallback;
        $this->data = $data;
        add_action('init', [$this, 'onInit']);
    }


    function ourRenderCallback($attributes, $content){
        ob_start();
        require get_theme_file_path("/our-blocks/{$this->name}.php");
        return ob_get_clean();
    }

    function onInit(){
        wp_register_script($this->name, get_stylesheet_directory_uri() . "/build/{$this->name}.js", array('wp-blocks', 'wp-editor'));

        if ($this->data) {
            wp_localize_script($this->name, $this->name, $this->data);
          }

        $ourArgs = array(
            'editor_script' => $this->name
        );

        if($this->renderCallback){
            $ourArgs['render_callback'] = [$this, 'ourRenderCallback'];
        }

        register_block_type("ourblocktheme/{$this->name}", $ourArgs);
    }
  }

  new JSXBlock('banner', true, ['fallbackimage' => get_theme_file_uri('/images/library-hero.jpg')]);
  new JSXBlock('genericheading');
  new JSXBlock('genericbutton');


?>

