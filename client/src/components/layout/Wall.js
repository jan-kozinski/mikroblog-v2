import { useEffect } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { fetchPosts } from "../../app-state/actions/post-actions";
import LoadingPosts from "../LoadingPosts";
import ListPosts from "../ListPosts";

const Wall = (props) => {
  useEffect(() => {
    (async () => {
      await props.fetchPosts();
    })();
  }, []);
  if (props.error) {
    console.log(props.error);
    return <div>kurwa</div>;
  }
  return <main>{props.isLoading ? <LoadingPosts /> : <ListPosts />}</main>;
};

Wall.propTypes = {
  isLoading: PropTypes.bool.isRequired,
  error: PropTypes.string,
};

const mapStateToProps = (state) => {
  console.log(state);
  return {
    isLoading: state.posts.loading,
    error: state.errors.msg,
  };
};

export default connect(mapStateToProps, { fetchPosts })(Wall);
