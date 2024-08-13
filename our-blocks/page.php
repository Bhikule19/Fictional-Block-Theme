<?php

display_page_banner_subtitle();
    ?>
   
   

    <div class="container container--narrow page-section">
        <!-- we will check we the page has a id of its parent as the parent has 0 so the parent page would not have any id -->
        <?php 
        $parent_id = wp_get_post_parent_id(get_the_ID()); //This will give us the parent id of the current loaded post
        if ($parent_id) { ?> 
             <div class="metabox metabox--position-up metabox--with-home-link">
             <p>
               <a class="metabox__blog-home-link" href="<?php echo get_permalink($parent_id) ?>"><i class="fa fa-home" aria-hidden="true"></i>Back to <?php echo get_the_title($parent_id) ; ?></a> <span class="metabox__main"><?php echo the_title(); ?></span>
             </p>
           </div>
       <? } ; ?>


       <?php 

       $childrenOfArray = get_pages(array(
            'child_of' => get_the_ID(), //This will display all pages if no parent is found
        )); 
            if($parent_id || $childrenOfArray){ ?>
                 <div class="page-links">
        <h2 class="page-links__title"><a href="<?php echo get_permalink($parent_id); ?>"><?php echo get_the_title($parent_id); ?></a></h2>
        <ul class="min-list">
          <?php 
          if($parent_id){
            $childrenOf = $parent_id; // get the children of the creent parent pge
          } else {
            $childrenOf = get_the_ID(); //This will display all pages if no parent is found
          }


          wp_list_pages(array(
            'title_li' => '',
            'depth' => 1,
            'child_of' => $childrenOf, 
            'sort-column' => 'menu_order',
          )); ?>
        </ul>
      </div>
            
        <?php     } ?>
     

      <div class="generic-content">
        <?php the_content(); ?>
      </div>
    </div>

    <?php 
    
?>