<?php

display_page_banner_subtitle(array(
  'title' => 'All Programs',
  'subtitle' => 'See all the programs available for the public.',
));

?>



<div class="container container--narrow page-section">

    <ul class="link-list min-list" >
        <?php
        while(have_posts()) {
            the_post(); ?>
            <li><a href="<?php echo get_permalink(); ?>" ><?php the_title(); ?></a></li>
        <?php }
        echo paginate_links();
        ?>
    </ul>
</div>
